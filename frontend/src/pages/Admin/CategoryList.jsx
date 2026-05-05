import { useState } from "react";
import {
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
  useFetchCategoriesQuery,
} from "../../redux/api/categoryApiSlice";
import { toast } from "react-toastify";
import CategoryForm from "../../components/CategoryForm";
import Modal from "../../components/Modal";
import AdminMenu from "./AdminMenu";

const CategoryList = () => {
  const { data: categories } = useFetchCategoriesQuery();
  const [name, setName] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [updatingName, setUpdatingName] = useState("");
  const [modalVisible, setModalVisible] = useState(false);

  const [createCategory] = useCreateCategoryMutation();
  const [updateCategory] = useUpdateCategoryMutation();
  const [deleteCategory] = useDeleteCategoryMutation();

  const handleCreateCategory = async (e) => {
    e.preventDefault();
    if (!name) return toast.error("Category name is required");
    try {
      const result = await createCategory({ name }).unwrap();
      if (result.error) { toast.error(result.error); return; }
      setName("");
      toast.success(`"${result.name}" created`);
    } catch (error) {
      toast.error("Creating category failed, try again.");
    }
  };

  const handleUpdateCategory = async (e) => {
    e.preventDefault();
    if (!updatingName) return toast.error("Category name is required");
    try {
      const result = await updateCategory({
        categoryId: selectedCategory._id,
        updatedCategory: { name: updatingName },
      }).unwrap();
      if (result.error) { toast.error(result.error); return; }
      toast.success(`"${result.name}" updated`);
      setSelectedCategory(null);
      setUpdatingName("");
      setModalVisible(false);
    } catch (error) {
      toast.error("Update failed");
    }
  };

  const handleDeleteCategory = async () => {
    try {
      const result = await deleteCategory(selectedCategory._id).unwrap();
      if (result.error) { toast.error(result.error); return; }
      toast.success(`"${result.name}" deleted`);
      setSelectedCategory(null);
      setModalVisible(false);
    } catch (error) {
      toast.error("Deletion failed. Try again.");
    }
  };

  return (
    <div className="px-4 sm:px-8 py-6">
      <AdminMenu />

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Create form */}
        <div className="lg:w-80 flex-shrink-0">
          <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl p-6">
            <h2 className="font-bold text-lg mb-4">New Category</h2>
            <CategoryForm
              value={name}
              setValue={setName}
              handleSubmit={handleCreateCategory}
              buttonText="Create"
            />
          </div>
        </div>

        {/* Category list */}
        <div className="flex-1">
          <h2 className="font-bold text-lg mb-4">All Categories <span className="text-gray-500 font-normal text-sm">({categories?.length || 0})</span></h2>
          <div className="flex flex-wrap gap-2">
            {categories?.map((category) => (
              <button
                key={category._id}
                onClick={() => {
                  setModalVisible(true);
                  setSelectedCategory(category);
                  setUpdatingName(category.name);
                }}
                className="bg-[#1a1a1a] border border-[#2a2a2a] hover:border-pink-500 text-gray-300 hover:text-pink-400 text-sm font-medium py-2 px-4 rounded-xl transition-colors"
              >
                {category.name}
              </button>
            ))}
            {!categories?.length && (
              <p className="text-gray-600 text-sm">No categories yet. Create one above.</p>
            )}
          </div>
        </div>
      </div>

      <Modal isOpen={modalVisible} onClose={() => setModalVisible(false)}>
        <h2 className="font-bold text-lg mb-4">Edit Category</h2>
        <CategoryForm
          value={updatingName}
          setValue={setUpdatingName}
          handleSubmit={handleUpdateCategory}
          buttonText="Update"
          handleDelete={handleDeleteCategory}
        />
      </Modal>
    </div>
  );
};

export default CategoryList;
