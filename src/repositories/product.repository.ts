import { AppDataSource } from "../config/data-source";
import { Product } from "../schemas/product.entity";

// Fetch all products
export const getAllProducts = async (): Promise<Product[]> => {
  const productRepository = AppDataSource.getRepository(Product);
  return await productRepository.find();
};

// Fetch a product by ID
export const getProductById = async (
  productId: string
): Promise<Product | null> => {
  const productRepository = AppDataSource.getRepository(Product);
  return await productRepository.findOne({ where: { id: productId } });
};

// Add a single product
export const addProduct = async (
  productData: Partial<Product>
): Promise<Product> => {
  const productRepository = AppDataSource.getRepository(Product);
  const product = productRepository.create(productData);
  return await productRepository.save(product); 
};

// Add multiple products
export const addProducts = async (
  products: Partial<Product>[]
): Promise<Product[]> => {
  const productRepository = AppDataSource.getRepository(Product);

  // Ensure products array is valid and filter out any undefined/null items
  const validProducts = products.filter(
    (product): product is Partial<Product> => !!product
  );

  const productEntities = validProducts.map((product) =>
    productRepository.create(product)
  );
  return await productRepository.save(productEntities);
};


// Delete a product by ID
export const deleteProductById = async (id: string): Promise<boolean> => {
  const productRepository = AppDataSource.getRepository(Product);
  const result = await productRepository.delete(id);
  return result.affected !== 0; // Check if rows were affected
};

// Delete all products
export const deleteAllProducts = async (): Promise<void> => {
  const productRepository = AppDataSource.getRepository(Product);
  await productRepository.clear(); // Deletes all rows from the table
};
