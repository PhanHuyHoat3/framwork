import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store/store';
import { useEffect } from 'react';
import { fetchCategory1 } from '../store/slice/categoryProduct';

const CategoryProduct = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { categories, loading } = useSelector(
    (state: RootState) => state.category
  );

  useEffect(() => {
    dispatch(fetchCategory1());
  }, [dispatch]);

  if (loading) {
    return <p className="text-center text-gray-500 p-2">Loading...</p>;
  }

  return (
    <ul className="p-2">
      {categories.map((item) => (
        <li
          key={item.id}
          className="px-4 py-2 hover:bg-gray-200 cursor-pointer rounded"
        >
          {item.name}
        </li>
      ))}
    </ul>
  );
};

export default CategoryProduct;
