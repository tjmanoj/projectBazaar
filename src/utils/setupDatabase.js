import { db } from '../firebaseConfig';
import { collection, addDoc, writeBatch, doc, setDoc } from 'firebase/firestore';

const sampleProjects = [
  {
    title: "E-commerce Website",
    description: "A full-stack e-commerce website with shopping cart, user authentication, and payment integration.",
    demoLink: "https://example.com/ecommerce-demo",
    price: 1499,
    sourceCodeUrl: "",
    downloadUrl: "",
    category: "final-year",
    technologies: ["React", "Node.js", "MongoDB", "Express"],
    features: [
      "User authentication",
      "Shopping cart",
      "Payment integration",
      "Admin dashboard",
      "Order tracking"
    ],
    thumbnail: "https://source.unsplash.com/featured/?ecommerce",
    status: 'published',
    createdAt: new Date(),
    updatedAt: new Date(),
    razorpayOrderId: "",
    razorpayPaymentId: "",
    paymentStatus: "pending",
    purchasedBy: [],
    lastPurchasedAt: null
  },
  {
    title: "Todo App",
    description: "A simple todo application with basic CRUD operations and user authentication.",
    demoLink: "https://example.com/todo-demo",
    price: 499,
    sourceCodeUrl: "",
    downloadUrl: "",
    category: "mini-project",
    technologies: ["React", "Firebase", "Material-UI"],
    features: [
      "Task management",
      "Due dates",
      "Priority levels",
      "Categories"
    ],
    thumbnail: "https://source.unsplash.com/featured/?todo",
    status: 'published',
    createdAt: new Date(),
    updatedAt: new Date(),
    razorpayOrderId: "",
    razorpayPaymentId: "",
    paymentStatus: "pending",
    purchasedBy: [],
    lastPurchasedAt: null
  },
  {
    title: "Machine Learning Project",
    description: "Image classification using deep learning with TensorFlow and Python.",
    demoLink: "https://example.com/ml-demo",
    price: 2499,
    sourceCodeUrl: "",
    downloadUrl: "",
    category: "mentorship",
    technologies: ["Python", "TensorFlow", "OpenCV", "NumPy"],
    features: [
      "Image classification",
      "Model training",
      "Dataset preparation",
      "Performance optimization"
    ],
    thumbnail: "https://source.unsplash.com/featured/?ai",
    status: 'published',
    createdAt: new Date(),
    updatedAt: new Date(),
    razorpayOrderId: "",
    razorpayPaymentId: "",
    paymentStatus: "pending",
    purchasedBy: [],
    lastPurchasedAt: null
  }
];

export const setupDatabase = async () => {
  try {
    // Add sample projects
    const batch = writeBatch(db);
    const projectsCollection = collection(db, 'projects');

    for (const project of sampleProjects) {
      const docRef = doc(projectsCollection);
      batch.set(docRef, {
        id: docRef.id,
        ...project
      });
    }

    await batch.commit();
    console.log('Sample projects added successfully!');

    // Set up Firestore rules (needs to be done in Firebase Console)
    console.log(`
    Please add these rules in your Firebase Console (Firestore Database > Rules):

    rules_version = '2';
    service cloud.firestore {
      match /databases/{database}/documents {
        // Allow anyone to read projects
        match /projects/{projectId} {
          allow read: if true;
          allow write: if request.auth != null && request.auth.token.admin == true;
        }
        
        // User profiles - users can only read/write their own data
        match /users/{userId} {
          allow read, write: if request.auth != null && request.auth.uid == userId;
        }
        
        // Orders - users can only access their own orders
        match /orders/{orderId} {
          allow read, write: if request.auth != null && 
            request.auth.uid == resource.data.userId;
        }
      }
    }
    `);

    // Set up Authentication rules
    console.log(`
    Please enable these authentication methods in Firebase Console (Authentication > Sign-in method):
    1. Email/Password
    2. (Optional) Google Sign-in
    `);

  } catch (error) {
    console.error('Error setting up database:', error);
  }
};
