import React, { useState, useEffect } from 'react';
import { mealsApi, dishesApi } from '../../services/api.js';
import { Meal, Dish } from '../../types/index.js';
import { Modal } from '../../components/common/Modal.js';
import {
  CalendarDays,
  Plus,
  Edit2,
  Trash2,
  Utensils,
  Clock,
  CheckCircle2,
  AlertCircle,
  Search,
  Layers,
} from 'lucide-react';

const MEAL_TYPES = ['breakfast', 'lunch', 'snacks', 'dinner'];
const DISH_CATEGORIES = [
  'Main Course',
  'Curry & Dal',
  'Bread & Rice',
  'Snacks & Beverages',
  'Dessert & Sweets',
  'Salad & Accompaniments',
  'Breakfast Special',
];

export const MenuManagementPage: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [meals, setMeals] = useState<Meal[]>([]);
  const [allDishes, setAllDishes] = useState<Dish[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Meal Modal State
  const [mealModalOpen, setMealModalOpen] = useState<boolean>(false);
  const [editingMealId, setEditingMealId] = useState<string | null>(null);
  const [mealType, setMealType] = useState<string>('breakfast');
  const [servingTime, setServingTime] = useState<string>('07:30 AM - 09:30 AM');
  const [specialNote, setSpecialNote] = useState<string>('');
  const [selectedDishIds, setSelectedDishIds] = useState<string[]>([]);

  // Dish Modal State
  const [dishModalOpen, setDishModalOpen] = useState<boolean>(false);
  const [newDishName, setNewDishName] = useState('');
  const [newDishCategory, setNewDishCategory] = useState(DISH_CATEGORIES[0]);
  const [newDishIsVeg, setNewDishIsVeg] = useState(true);
  const [newDishCalories, setNewDishCalories] = useState(250);
  const [newDishDescription, setNewDishDescription] = useState('');

  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    loadMeals();
    loadDishes();
  }, [selectedDate]);

  const loadMeals = async () => {
    setIsLoading(true);
    try {
      const res = await mealsApi.getMeals({ date: selectedDate });
      if (res.data.success) {
        setMeals(res.data.meals || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const loadDishes = async () => {
    try {
      const res = await dishesApi.getDishes();
      if (res.data.success) {
        setAllDishes(res.data.dishes || []);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const openCreateMealModal = () => {
    setEditingMealId(null);
    setMealType('breakfast');
    setServingTime('07:30 AM - 09:30 AM');
    setSpecialNote('');
    setSelectedDishIds([]);
    setErrorMsg(null);
    setMealModalOpen(true);
  };

  const openEditMealModal = (meal: Meal) => {
    setEditingMealId(meal._id);
    setMealType(meal.mealType);
    setServingTime(meal.servingTime);
    setSpecialNote(meal.specialNote || '');
    setSelectedDishIds(meal.dishes.map((d) => d._id));
    setErrorMsg(null);
    setMealModalOpen(true);
  };

  const toggleDishSelection = (id: string) => {
    if (selectedDishIds.includes(id)) {
      setSelectedDishIds(selectedDishIds.filter((d) => d !== id));
    } else {
      setSelectedDishIds([...selectedDishIds, id]);
    }
  };

  const handleMealSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (selectedDishIds.length === 0) {
      setErrorMsg('Please select at least one dish for this meal.');
      return;
    }

    try {
      if (editingMealId) {
        await mealsApi.updateMeal(editingMealId, {
          mealType: mealType as any,
          servingTime,
          specialNote,
          dishes: selectedDishIds as any,
        });
        setSuccessMsg('Meal updated successfully.');
      } else {
        await mealsApi.createMeal({
          date: selectedDate,
          mealType: mealType as any,
          servingTime,
          specialNote,
          dishes: selectedDishIds as any,
        });
        setSuccessMsg('Meal schedule created successfully.');
      }
      setMealModalOpen(false);
      await loadMeals();
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to save meal.');
    }
  };

  const handleDeleteMeal = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this meal schedule?')) return;
    try {
      await mealsApi.deleteMeal(id);
      setSuccessMsg('Meal deleted successfully.');
      await loadMeals();
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to delete meal.');
    }
  };

  const handleCreateDish = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await dishesApi.createDish({
        name: newDishName,
        category: newDishCategory,
        isVegetarian: newDishIsVeg,
        calories: newDishCalories,
        description: newDishDescription,
      });
      setSuccessMsg(`Dish "${newDishName}" added to catalog.`);
      setNewDishName('');
      setNewDishDescription('');
      setDishModalOpen(false);
      await loadDishes();
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to create dish.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
            <CalendarDays className="w-7 h-7 text-emerald-600" />
            <span>Menu & Dish Schedule Management</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Publish and manage daily breakfast, lunch, snacks, and dinner dish menus.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setDishModalOpen(true)}
            className="px-4 py-2.5 text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-xl shadow-2xs transition-all flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Add Dish to Catalog</span>
          </button>

          <button
            type="button"
            onClick={openCreateMealModal}
            className="px-5 py-2.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-md shadow-emerald-600/20 transition-all flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Schedule Meal</span>
          </button>
        </div>
      </div>

      {/* Date Picker Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Selected Date:
          </span>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
          />
        </div>
        <span className="text-xs text-slate-500 font-medium">
          Showing {meals.length} scheduled meals for this date
        </span>
      </div>

      {/* Alerts */}
      {successMsg && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-800 text-xs flex items-center justify-between">
          <span className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            {successMsg}
          </span>
          <button onClick={() => setSuccessMsg(null)} className="text-emerald-700 font-bold">
            ×
          </button>
        </div>
      )}

      {/* Meals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {isLoading ? (
          <div className="col-span-2 text-center py-12 text-slate-400 text-sm">
            Loading menu schedules...
          </div>
        ) : meals.length === 0 ? (
          <div className="col-span-2 bg-white rounded-3xl p-12 text-center border border-dashed border-slate-300 space-y-3">
            <Utensils className="w-10 h-10 text-slate-400 mx-auto" />
            <h3 className="font-bold text-slate-800 text-base">No meals scheduled for {selectedDate}</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Click the "Schedule Meal" button above to add Breakfast, Lunch, Snacks, or Dinner.
            </p>
          </div>
        ) : (
          meals.map((m) => {
            const mTitle = m.mealType.charAt(0).toUpperCase() + m.mealType.slice(1);
            return (
              <div
                key={m._id}
                className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div>
                      <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                        {mTitle}
                      </span>
                      <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{m.servingTime}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => openEditMealModal(m)}
                        className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors"
                        title="Edit Meal"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteMeal(m._id)}
                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                        title="Delete Meal"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Dishes */}
                  <div className="space-y-2 mt-4">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                      Dishes on Menu:
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {m.dishes.map((dish) => (
                        <span
                          key={dish._id}
                          className="px-3 py-1 bg-slate-50 text-slate-800 text-xs font-semibold rounded-xl border border-slate-200 flex items-center gap-1.5"
                        >
                          <span
                            className={`w-2 h-2 rounded-full ${
                              dish.isVegetarian ? 'bg-emerald-500' : 'bg-red-500'
                            }`}
                          />
                          {dish.name}
                        </span>
                      ))}
                    </div>
                  </div>

                  {m.specialNote && (
                    <div className="mt-3 text-xs bg-amber-50 text-amber-800 p-2.5 rounded-xl border border-amber-200/60 font-medium">
                      💡 {m.specialNote}
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Modal: Schedule / Edit Meal */}
      <Modal
        isOpen={mealModalOpen}
        onClose={() => setMealModalOpen(false)}
        title={editingMealId ? 'Edit Scheduled Meal' : 'Schedule New Meal'}
        subtitle={`Date: ${selectedDate}`}
        maxWidth="2xl"
      >
        <form onSubmit={handleMealSubmit} className="space-y-5">
          {errorMsg && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1.5">
                Meal Slot
              </label>
              <select
                disabled={!!editingMealId}
                value={mealType}
                onChange={(e) => setMealType(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              >
                {MEAL_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t.toUpperCase()}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1.5">
                Serving Time Window
              </label>
              <input
                type="text"
                required
                value={servingTime}
                onChange={(e) => setServingTime(e.target.value)}
                placeholder="12:30 PM - 02:30 PM"
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1.5">
              Special Chef Note (Optional)
            </label>
            <input
              type="text"
              value={specialNote}
              onChange={(e) => setSpecialNote(e.target.value)}
              placeholder="e.g. Sunday Special Sweet Included"
              className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>

          {/* Dish Selection Grid */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Select Dishes for this Meal ({selectedDishIds.length} chosen)
              </label>
            </div>

            <div className="max-h-60 overflow-y-auto p-3 bg-slate-50 rounded-2xl border border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-2">
              {allDishes.map((dish) => {
                const isSelected = selectedDishIds.includes(dish._id);
                return (
                  <button
                    type="button"
                    key={dish._id}
                    onClick={() => toggleDishSelection(dish._id)}
                    className={`p-2.5 rounded-xl text-left text-xs font-semibold border transition-all flex items-center justify-between ${
                      isSelected
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <div>
                      <p className="line-clamp-1">{dish.name}</p>
                      <span
                        className={`text-[10px] ${
                          isSelected ? 'text-emerald-100' : 'text-slate-400'
                        }`}
                      >
                        {dish.category}
                      </span>
                    </div>
                    <span
                      className={`w-2 h-2 rounded-full flex-shrink-0 ${
                        dish.isVegetarian
                          ? isSelected
                            ? 'bg-white'
                            : 'bg-emerald-500'
                          : 'bg-red-400'
                      }`}
                    />
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setMealModalOpen(false)}
              className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-md shadow-emerald-600/20"
            >
              Save Schedule
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal: Create Dish Catalog */}
      <Modal
        isOpen={dishModalOpen}
        onClose={() => setDishModalOpen(false)}
        title="Add New Dish to Catalog"
        subtitle="This dish will be available to schedule on any meal slot"
        maxWidth="md"
      >
        <form onSubmit={handleCreateDish} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1.5">
              Dish Name *
            </label>
            <input
              type="text"
              required
              value={newDishName}
              onChange={(e) => setNewDishName(e.target.value)}
              placeholder="e.g. Malai Kofta"
              className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1.5">
                Category
              </label>
              <select
                value={newDishCategory}
                onChange={(e) => setNewDishCategory(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              >
                {DISH_CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1.5">
                Calories (approx)
              </label>
              <input
                type="number"
                value={newDishCalories}
                onChange={(e) => setNewDishCalories(Number(e.target.value))}
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="dishVeg"
              checked={newDishIsVeg}
              onChange={(e) => setNewDishIsVeg(e.target.checked)}
              className="w-4 h-4 text-emerald-600 rounded border-slate-300"
            />
            <label htmlFor="dishVeg" className="text-xs font-semibold text-slate-700 cursor-pointer">
              Vegetarian Dish
            </label>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1.5">
              Description (Optional)
            </label>
            <textarea
              rows={2}
              value={newDishDescription}
              onChange={(e) => setNewDishDescription(e.target.value)}
              placeholder="Short preparation detail..."
              className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 resize-none"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setDishModalOpen(false)}
              className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-md shadow-emerald-600/20"
            >
              Add Dish
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
