import { useState, useEffect } from "react";
import AdminMenu from "./AdminMenu";
import { useNavigate, useParams } from "react-router-dom";
import {
  useUpdateProductMutation,
  useDeleteProductMutation,
  useGetProductByIdQuery,
  useUploadProductImageMutation,
} from "../../redux/api/productApiSlice";
import { useFetchCategoriesQuery } from "../../redux/api/categoryApiSlice";
import { toast } from "react-toastify";

const inputClass =
  "w-full bg-[#0f0f0f] border border-[#2a2a2a] text-white placeholder-gray-600 rounded-xl px-4 py-2.5 focus:border-pink-500 focus:outline-none transition-colors";
const labelClass = "block text-sm font-medium text-gray-400 mb-1.5";

const ProductUpdate = () => {
  const params = useParams();
  const { data: productData } = useGetProductByIdQuery(params._id);

  const [image, setImage] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [quantity, setQuantity] = useState("");
  const [brand, setBrand] = useState("");
  const [stock, setStock] = useState(0);

  const navigate = useNavigate();
  const { data: categories = [] } = useFetchCategoriesQuery();
  const [uploadProductImage] = useUploadProductImageMutation();
  const [updateProduct] = useUpdateProductMutation();
  const [deleteProduct] = useDeleteProductMutation();

  useEffect(() => {
    if (productData?._id) {
      setName(productData.name);
      setDescription(productData.description);
      setPrice(productData.price);
      setCategory(productData.category?._id);
      setQuantity(productData.quantity);
      setBrand(productData.brand);
      setImage(productData.image);
      setStock(productData.countInStock);
    }
  }, [productData]);

  const uploadFileHandler = async (e) => {
    const formData = new FormData();
    formData.append("image", e.target.files[0]);
    try {
      const res = await uploadProductImage(formData).unwrap();
      toast.success("Image updated");
      setImage(res.image);
    } catch {
      toast.error("Image upload failed");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("image", image);
      formData.append("name", name);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("category", category);
      formData.append("quantity", quantity);
      formData.append("brand", brand);
      formData.append("countInStock", stock);

      const data = await updateProduct({ productId: params._id, formData });
      if (data?.error) {
        toast.error(data.error);
      } else {
        toast.success("Product updated");
        navigate("/admin/allproductslist");
      }
    } catch {
      toast.error("Product update failed. Try again.");
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      const { data } = await deleteProduct(params._id);
      toast.success(`"${data.name}" deleted`);
      navigate("/admin/allproductslist");
    } catch {
      toast.error("Delete failed. Try again.");
    }
  };

  return (
    <div className="px-4 sm:px-8 py-6">
      <AdminMenu />

      <div className="max-w-3xl">
        <h1 className="text-2xl font-bold tracking-tight mb-6">Update Product</h1>

        {/* Image */}
        <div className="mb-6">
          {image && (
            <img src={image} alt="product" className="w-full h-52 object-cover rounded-2xl mb-3" />
          )}
          <label className="flex flex-col items-center justify-center w-full h-28 bg-[#0f0f0f] border-2 border-dashed border-[#2a2a2a] hover:border-pink-500 rounded-2xl cursor-pointer transition-colors">
            <span className="text-gray-500 text-sm">Click to change image</span>
            <input type="file" name="image" accept="image/*" onChange={uploadFileHandler} className="hidden" />
          </label>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Product name</label>
              <input type="text" className={inputClass} value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
            <div>
              <label className={labelClass}>Price ($)</label>
              <input type="number" className={inputClass} value={price} onChange={(e) => setPrice(e.target.value)} required />
            </div>
            <div>
              <label className={labelClass}>Quantity</label>
              <input type="number" className={inputClass} value={quantity} onChange={(e) => setQuantity(e.target.value)} required />
            </div>
            <div>
              <label className={labelClass}>Brand</label>
              <input type="text" className={inputClass} value={brand} onChange={(e) => setBrand(e.target.value)} required />
            </div>
            <div>
              <label className={labelClass}>Count in stock</label>
              <input type="number" className={inputClass} value={stock} onChange={(e) => setStock(e.target.value)} required />
            </div>
            <div>
              <label className={labelClass}>Category</label>
              <select className={inputClass} value={category} onChange={(e) => setCategory(e.target.value)}>
                <option value="">Select category</option>
                {categories.map((c) => (
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
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>

          <div className="flex gap-3 pt-1">
            <button
              type="submit"
              className="bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl px-6 py-2.5 transition-colors"
            >
              Update Product
            </button>
            <button
              type="button"
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl px-6 py-2.5 transition-colors"
            >
              Delete Product
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductUpdate;
