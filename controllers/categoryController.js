import Category from '../models/Category.js';

// Create Category
export const createCategory = async (req, res) => {
  try {
    const franchiseId =
      req.user.role === 'franchise_admin'
        ? req.user.franchiseId
        : req.body.franchiseId;

    const { name, position } = req.body;

    const cat = await Category.create({ name, position, franchiseId });
    res.status(201).json(cat);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// List Categories
export const listCategories = async (req, res) => {
  try {
    const franchiseId =
      req.user.role === 'franchise_admin'
        ? req.user.franchiseId
        : req.query.franchiseId;

    const filter = franchiseId ? { franchiseId } : {};
    const cats = await Category.find(filter).sort({ position: 1 }); // position ke basis pe sort
    res.json(cats);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update Category
export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const franchiseId =
      req.user.role === 'franchise_admin'
        ? req.user.franchiseId
        : req.body.franchiseId;

    const { name, position } = req.body;

    const updated = await Category.findOneAndUpdate(
      { _id: id, franchiseId },
      { name, position },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: 'Category not found' });
    }

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete Category
export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const franchiseId =
      req.user.role === 'franchise_admin'
        ? req.user.franchiseId
        : req.body.franchiseId;

    const deleted = await Category.findOneAndDelete({ _id: id, franchiseId });

    if (!deleted) {
      return res.status(404).json({ message: 'Category not found' });
    }

    res.json({ message: 'Category deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
