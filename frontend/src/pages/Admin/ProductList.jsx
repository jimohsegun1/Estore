import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  useCreateProductMutation,
  useUploadProductImageMutation,
} from "../../redux/api/productApiSlice";
import { useFetchCategoriesQuery } from "../../redux/api/categoryApiSlice";
import { toast } from "react-toastify";
import AdminMenu from "./AdminMenu";

const inputClass =
  "w-full bg-[#0f0f0f] border border-[#2a2a2a] text-white placeholder-gray-600 rounded-xl px-4 py-2.5 focus:border-pink-500 focus:outline-none transition-colors";
const labelClass = "block text-sm font-medium text-gray-400 mb-1.5";

const ProductList = () => {
  const [image, setImage] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [quantity, setQuantity] = useState("");
  const [brand, setBrand] = useState("");
  const [stock, setStock] = useState(0);
  const [imageUrl, setImageUrl] = useState(null);

  const navigate = useNavigate();
  const [uploadProductImage] = useUploadProductImageMutation();
  const [createProduct] = useCreateProductMutation();
  const { data: categories } = useFetchCategoriesQuery();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const productData = new FormData();
      productData.append("image", image);
      productData.append("name", name);
      productData.append("description", description);
      productData.append("price", price);
      productData.append("category", category);
      productData.append("quantity", quantity);
      productData.append("brand", brand);
      productData.append("countInStock", stock);

      const { data } = await createProduct(productData);
      if (data.error) {
        toast.error("Product create failed. Try again.");
      } else {
        toast.success(`"${data.name}" created`);
        navigate("/admin/allproductslist");
      }
    } catch (error) {
      toast.error("Product create failed. Try again.");
    }
  };

  const uploadFileHandler = async (e) => {
    const formData = new FormData();
    formData.append("image", e.target.files[0]);
    try {
      const res = await uploadProductImage(formData).unwrap();
      toast.success("Image uploaded");
      setImage(res.image);
      setImageUrl(res.image);
    } catch (error) {
      toast.error(error?.data?.message || error.error);
    }
  };

  return (
    <div className="px-4 sm:px-8 py-6">
      <AdminMenu />

      <div className="max-w-3xl">
        <h1 className="text-2xl font-bold tracking-tight mb-6">Create Product</h1>

        {/* Image upload */}
        <div className="mb-6">
          {imageUrl && (
            <img src={imageUrl} alt="preview" className="w-full h-52 object-cover rounded-2xl mb-3" />
          )}
          <label className="flex flex-col items-center justify-center w-full h-32 bg-[#0f0f0f] border-2 border-dashed border-[#2a2a2a] hover:border-pink-500 rounded-2xl cursor-pointer transition-colors">
            <span className="text-gray-500 text-sm">{imageUrl ? "Change image" : "Click to upload image"}</span>
            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={uploadFileHandler}
              className="hidden"
            />
          </label>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Product name</label>
              <input type="text" className={inputClass} placeholder="e.g. iPhone 15 Pro" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
            <div>
              <label className={labelClass}>Price ($)</label>
              <input type="number" className={inputClass} placeholder="0.00" value={price} onChange={(e) => setPrice(e.target.value)} required />
            </div>
            <div>
              <label className={labelClass}>Quantity</label>
              <input type="number" className={inputClass} placeholder="1" value={quantity} onChange={(e) => setQuantity(e.target.value)} required />
            </div>
            <div>
              <label className={labelClass}>Brand</label>
              <input type="text" className={inputClass} placeholder="Apple" value={brand} onChange={(e) => setBrand(e.target.value)} required />
            </div>
            <div>
              <label className={labelClass}>Count in stock</label>
              <input type="number" className={inputClass} placeholder="0" value={stock} onChange={(e) => setStock(e.target.value)} required />
            </div>
            <div>
              <label className={labelClass}>Category</label>
              <select className={inputClass} value={category} onChange={(e) => setCategory(e.target.value)} required>
                <option value="">Select category</option>
                {categories?.map((c) => (
                  <option key={c._id} value={c._id}>{c.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className={labelClass}>Description</label>
            <textarea
              rows={4}
              className={`${inputClass} resize-none`}
              placeholder="Describe the product…"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="bg-pink-600 hover:bg-pink-700 text-white font-semibold rounded-xl px-8 py-2.5 transition-colors"
          >
            Create Product
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProductList;
