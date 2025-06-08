import { 
  collection, 
  query, 
  where, 
  getDocs, 
  doc, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  Timestamp, 
  orderBy,
  FirestoreDataConverter,
  QueryDocumentSnapshot,
  arrayUnion,
  arrayRemove
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../firebaseConfig';
import { Project, ProjectCreate, ProjectUpdate } from '../types/Project';

const projectConverter: FirestoreDataConverter<Project> = {
  toFirestore: (project: Project) => {
    const { id, ...projectData } = project;
    const data = {
      ...projectData,
      createdAt: Timestamp.fromDate(project.createdAt),
      updatedAt: Timestamp.fromDate(project.updatedAt),
      status: project.status || 'published',
    };
    
    // Convert Date objects to Timestamps for payment-related fields
    if (project.lastPurchasedAt) {
      data.lastPurchasedAt = Timestamp.fromDate(project.lastPurchasedAt);
    }
    
    return data;
  },
  fromFirestore: (snapshot: QueryDocumentSnapshot) => {
    const data = snapshot.data();
    return {
      ...data,
      id: snapshot.id,
      createdAt: data.createdAt?.toDate() || new Date(),
      updatedAt: data.updatedAt?.toDate() || new Date(),
      status: data.status || 'published',
      // Convert Timestamps back to Dates for payment-related fields
      lastPurchasedAt: data.lastPurchasedAt?.toDate() || null,
      // Initialize payment related fields if they don't exist
      paymentStatus: data.paymentStatus || null,
      purchasedBy: data.purchasedBy || [],
      razorpayOrderId: data.razorpayOrderId || null,
      razorpayPaymentId: data.razorpayPaymentId || null,
      sourceCodeUrl: data.sourceCodeUrl || null,
    } as Project;
  },
};

const projectsCollection = 'projects';

export async function fetchProjects(category?: string) {
  try {
    const projectsRef = collection(db, projectsCollection).withConverter(projectConverter);
    let q;
    
    if (category && category !== 'all') {
      // Query with category filter
      q = query(
        projectsRef,
        where('category', '==', category)
      );
    } else {
      // Query for all projects
      q = query(projectsRef);
    }

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs
      .map(doc => doc.data())
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  } catch (error) {
    console.error('Error fetching projects:', error);
    throw error;
  }
}

export async function fetchProjectById(id: string): Promise<Project | null> {
  try {
    const docRef = doc(db, projectsCollection, id).withConverter(projectConverter);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? docSnap.data() : null;
  } catch (error) {
    console.error('Error fetching project:', error);
    throw error;
  }
}

export async function createProject(project: ProjectCreate) {
  try {
    const now = new Date();
    const projectData: Project = {
      ...project,
      id: '',  // Will be set by Firestore
      status: project.status || 'draft',
      createdAt: now,
      updatedAt: now,
    };

    const projectsRef = collection(db, projectsCollection).withConverter(projectConverter);
    const docRef = await addDoc(projectsRef, projectData);
    return { ...projectData, id: docRef.id };
  } catch (error) {
    console.error('Error creating project:', error);
    throw error;
  }
}

export async function updateProject(project: ProjectUpdate) {
  try {
    const { id, ...updateData } = project;
    updateData.updatedAt = new Date();

    const docRef = doc(db, projectsCollection, id).withConverter(projectConverter);
    await updateDoc(docRef, updateData as Partial<Project>);
    return { ...project, updatedAt: updateData.updatedAt };
  } catch (error) {
    console.error('Error updating project:', error);
    throw error;
  }
}

export async function deleteProject(id: string) {
  try {
    const docRef = doc(db, projectsCollection, id).withConverter(projectConverter);
    await deleteDoc(docRef);
  } catch (error) {
    console.error('Error deleting project:', error);
    throw error;
  }
}

export async function uploadProjectFile(projectId: string, file: File) {
  try {
    const storageRef = ref(storage, `projects/${projectId}/${file.name}`);
    await uploadBytes(storageRef, file);
    const downloadUrl = await getDownloadURL(storageRef);
    
    // Update project with new download URL
    const docRef = doc(db, projectsCollection, projectId).withConverter(projectConverter);
    await updateDoc(docRef, {
      downloadUrl,
      updatedAt: new Date()
    });
    
    return downloadUrl;
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
}

export async function updateProjectStatus(id: string, status: Project['status']) {
  try {
    const docRef = doc(db, projectsCollection, id).withConverter(projectConverter);
    await updateDoc(docRef, {
      status,
      updatedAt: new Date()
    });
  } catch (error) {
    console.error('Error updating project status:', error);
    throw error;
  }
}

export async function updatePaymentStatus(
  projectId: string, 
  razorpayOrderId: string, 
  razorpayPaymentId: string,
  userId: string,
  status: 'completed' | 'failed' = 'completed'
) {
  try {
    const docRef = doc(db, projectsCollection, projectId).withConverter(projectConverter);
    const now = new Date();
    
    await updateDoc(docRef, {
      razorpayOrderId,
      razorpayPaymentId,
      paymentStatus: status,
      lastPurchasedAt: now,
      purchasedBy: status === 'completed' ? 
        arrayUnion(userId) : // Add user to purchasedBy array only if payment completed
        arrayRemove(userId), // Remove user if payment failed
      updatedAt: now
    });
  } catch (error) {
    console.error('Error updating payment status:', error);
    throw error;
  }
}

export async function checkPurchaseStatus(projectId: string, userId: string): Promise<boolean> {
  try {
    const project = await fetchProjectById(projectId);
    if (!project) return false;
    
    return project.purchasedBy?.includes(userId) || false;
  } catch (error) {
    console.error('Error checking purchase status:', error);
    return false;
  }
}

export async function updateSourceCodeUrl(projectId: string, sourceCodeUrl: string) {
  try {
    const docRef = doc(db, projectsCollection, projectId).withConverter(projectConverter);
    await updateDoc(docRef, {
      sourceCodeUrl,
      updatedAt: new Date()
    });
  } catch (error) {
    console.error('Error updating source code URL:', error);
    throw error;
  }
}