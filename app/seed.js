const { MongoClient, ServerApiVersion } = require('mongodb');

const uri = "mongodb+srv://Admin:Admin50%2F%2F50%2F%2F%40@cluster0.kpg8y.mongodb.net/covermatt?retryWrites=true&w=majority";

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

const defaultProducts = [
  {
      name: "Luxury Silk Bedding Set",
      description: "Experience ultimate comfort with our premium 100% mulberry silk bedding set. Includes 1 fitted sheet, 1 flat sheet, and 2 pillowcases.",
      price: 24500,
      category: "bedding",
      image: "https://images.unsplash.com/photo-1522771730849-f635363228d9?auto=format&fit=crop&q=80&w=800",
      rating: 4.8,
      reviews: 124,
      stockLevel: "in-stock",
      isNewItem: true,
      features: ["100% Mulberry Silk", "Hypoallergenic", "Temperature Regulating"],
      createdAt: new Date(),
      updatedAt: new Date()
  },
  {
      name: "Orthopedic Memory Foam Mattress",
      description: "12-inch premium memory foam mattress designed for optimal spine alignment and pressure relief.",
      price: 85000,
      category: "mattresses",
      image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&q=80&w=800",
      rating: 4.9,
      reviews: 89,
      stockLevel: "in-stock",
      isNewItem: false,
      features: ["Cooling Gel Layer", "Motion Isolation", "10-Year Warranty"],
      createdAt: new Date(),
      updatedAt: new Date()
  },
  {
      name: "Plush Microfiber Throw Blanket",
      description: "Incredibly soft and warm throw blanket, perfect for cozy evenings on the couch or as an extra layer on your bed.",
      price: 4500,
      category: "blankets",
      image: "https://images.unsplash.com/photo-1574345422830-cb3e75a8929e?auto=format&fit=crop&q=80&w=800",
      rating: 4.7,
      reviews: 256,
      stockLevel: "low-stock",
      isNewItem: true,
      features: ["Machine Washable", "Anti-Pilling", "Oversized"],
      createdAt: new Date(),
      updatedAt: new Date()
  }
];

async function run() {
  try {
    await client.connect();
    console.log("Connected successfully to MongoDB server");
    
    const db = client.db("covermatt");
    const collection = db.collection("products");

    // Clear existing to avoid duplicates during testing
    await collection.deleteMany({});
    
    const result = await collection.insertMany(defaultProducts);
    console.log(`${result.insertedCount} documents were inserted`);

  } finally {
    await client.close();
  }
}

run().catch(console.dir);
