import { DevicesModal } from '@sochipark-apps-mono-frontend/sochipark-apk-features';
import { DevicesTable } from '@sochipark-apps-mono-frontend/sochipark-apk-features';
import { HeaderPage } from '@sochipark-apps-mono-frontend/ui';
import { Modal } from '@sochipark-apps-mono-frontend/ui';
import { FC, useState } from 'react';

const tableData = {
  columns: [
    { key: 'title', title: 'Название устройства' },
    { key: 'ip', title: 'IP адрес' },
  ],
  rows: [
    {
      id: '№1',
      title: '«Мой компьютер»',
      ip: '10.66.144.40',
    },
    {
      id: 'N2',
      title: '«Влад»',
      ip: '10.66.144.40',
    },
    {
      id: '№ 3',
      title: '«Сервер ADM-PPS»',
      ip: '10.66.144.40',
    },
  ],
};

export const DevicesPage: FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [currentEvent, setCurrentEvent] = useState<any>(null);
  const [isModalErrorOpen, setIsModalErrorOpen] = useState(false);
  const [isModalConfirmOpen, setIsModalConfirmOpen] = useState(false);
  const [data, setData] = useState(tableData);
  const [elementToDelete, setElementToDelete] = useState<string | null>(null);

  const handleSubmit = async (data: any) => {
    console.log('Данные мероприятия:', data);
  };

  const handleEdit = (id: string) => {
    const event = data.rows.find((item) => item.id === id);
    if (event) {
      setCurrentEvent(event);
      setModalMode('edit');
      setIsModalOpen(true);
    }
  };

  const handleAdd = () => {
    setCurrentEvent(null);
    setModalMode('create');
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    setElementToDelete(id);
    setIsModalConfirmOpen(true);
  };

  const closeModal = () => setIsModalConfirmOpen(false);

  const confirmModal = async () => {
    if (!elementToDelete) return;

    try {
      setData((prev) => ({
        ...prev,
        rows: prev.rows.filter((item) => item.id !== elementToDelete),
      }));
      closeModal();
    } catch (error) {
      console.error('Ошибка при удалении:', error);
      closeModal();
      setIsModalErrorOpen(true);
    }
  };

  return (
    <div>
      <HeaderPage title="Управление устройствами" onClick={handleAdd} />
      <DevicesTable data={data} onEdit={handleEdit} onDelete={handleDelete} />
      <DevicesModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        mode={modalMode}
        initialData={currentEvent}
      />
      <Modal
        title="Ошибка"
        text="При удалении возникла ошибка, попробуйте еще раз"
        isOpen={isModalErrorOpen}
        onClose={() => setIsModalErrorOpen(false)}
        confirmText="Хорошо"
      />
      <Modal
        title="Удалить мероприятие?"
        isOpen={isModalConfirmOpen}
        onClose={closeModal}
        onConfirm={confirmModal}
        cancelText="Отменить"
        confirmText="Удалить"
      />
    </div>
  );
};
