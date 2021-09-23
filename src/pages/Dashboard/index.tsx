import { useState, useEffect } from 'react';

import Header from '../../components/Header';
import api from '../../services/api';
import Food from '../../components/Food';
import ModalAddFood from '../../components/ModalAddFood';
import ModalEditFood from '../../components/ModalEditFood';
import { FoodsContainer } from './styles';

interface foodProps {
  id: number,
  name: string,
  description: string,
  price: number,
  available: boolean,
  image: string
}

function Dashboard() {
  const [foods, setFoods] = useState<foodProps[]>([]);
  const [editingFood, seteditingFood] = useState<foodProps>({} as foodProps);
  const [modalOpen, setmodalOpen] = useState<boolean>(false);
  const [editModalOpen, seteditModalOpen] = useState<boolean>(false);

  useEffect(() => {
    async function getFoods() {
      await api.get('/foods')
        .then((response) => setFoods(response.data))
    }

    getFoods();
  });

  async function handleAddFood(food: foodProps) {
    try {
      const response = await api.post('/foods', {
        ...food,
        available: true,
      });

      setFoods([...foods,
        response.data
      ]);
    } catch (err) {
      console.log(err);
    }
  }

  async function handleUpdateFood(food: foodProps) {
    try {
      const foodUpdated = await api.put(
        `/foods/${editingFood?.id}`,
        { ...editingFood, ...food },
      );

      const foodsUpdated = foods.map(f =>
        f.id !== foodUpdated.data.id ? f : foodUpdated.data,
      );

      setFoods(foodsUpdated);
    } catch (err) {
      console.log(err);
    }
  }

  async function handleDeleteFood(id: number) {
    await api.delete(`/foods/${id}`);

    const foodsFiltered = foods.filter(food => food.id !== id);

    setFoods(foodsFiltered);
  }

  function toggleModal() {
    setmodalOpen(!modalOpen);
  }

  function toggleEditModal() {
    seteditModalOpen(!editModalOpen);
  }

  function handleEditFood(food: foodProps) {
    seteditingFood(food);
    seteditModalOpen(true);
  }

  return (
    <>
      <Header openModal={toggleModal} />
      <ModalAddFood
        isOpen={modalOpen}
        setIsOpen={toggleModal}
        handleAddFood={handleAddFood}
      />
      <ModalEditFood
        isOpen={editModalOpen}
        setIsOpen={toggleEditModal}
        editingFood={editingFood}
        handleUpdateFood={handleUpdateFood}
      />

      <FoodsContainer data-testid="foods-list">
        {foods &&
          foods.map((food: foodProps) => (
            <Food
              key={food.id}
              food={food}
              handleDelete={handleDeleteFood}
              handleEditFood={handleEditFood}
            />
          ))}
      </FoodsContainer>
    </>
  );
};

export default Dashboard;
