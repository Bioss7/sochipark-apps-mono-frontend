import { useState, FormEvent, useEffect } from "react";
import { Button, SideModal, Input, Select, InputTime, Modal } from "@sochipark-apps-mono-frontend/ui";

interface IEventFormData {
  title: string;
  startTime: string;
  category: string;
  location: string;
}

interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: IEventFormData) => Promise<void> | void;
  mode?: "create" | "edit";
  initialData?: any;
}

export const EventModal = ({
  isOpen,
  onClose,
  onSubmit,
  mode = "create",
  initialData,
}: EventModalProps) => {
  const [formData, setFormData] = useState<IEventFormData>({
    title: "",
    startTime: "",
    category: "",
    location: "",
  });
  const [errors, setErrors] = useState<Record<keyof IEventFormData, string>>({
    title: "",
    startTime: "",
    category: "",
    location: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (mode === "edit" && initialData) {
      setFormData({
        title: initialData.title || "",
        startTime: initialData.startTime || "",
        category: "meeting",
        location: "online",
      });
    } else {
      setFormData({
        title: "",
        startTime: "",
        category: "",
        location: "",
      });
    }
    setErrors({
      title: "",
      startTime: "",
      category: "",
      location: "",
    });
  }, [mode, initialData, isOpen]);

  const categoryOptions = [
    { value: "meeting", label: "Встреча" },
    { value: "conference", label: "Конференция" },
    { value: "webinar", label: "Вебинар" },
  ];

  const locationOptions = [
    { value: "online", label: "Онлайн" },
    { value: "office", label: "Офис" },
    { value: "other", label: "Другое" },
  ];

  const handleInputChange = (field: keyof IEventFormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    setErrors((prev) => ({
      ...prev,
      [field]: "",
    }));
  };

  const validateForm = (): boolean => {
    const newErrors = {
      title: !formData.title ? "Пожалуйста, введите название мероприятия" : "",
      startTime: !formData.startTime ? "Укажите время начала мероприятия" : "",
      category: !formData.category ? "Пожалуйста, выберите категорию" : "",
      location: !formData.location ? "Пожалуйста, выберите локацию" : "",
    };

    setErrors(newErrors);
    return !Object.values(newErrors).some((error) => error);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setIsModalOpen(true);
    try {
      await onSubmit(formData);
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  const actions = (
    <>
      <Button
        type="button"
        variant="button-secondary"
        onClick={onClose}
        disabled={isSubmitting}
      >
        Отменить
      </Button>
      <Button type="submit" variant="button-primary" disabled={isSubmitting}>
        {mode === "create" ? "Создать" : "Сохранить"}
      </Button>
    </>
  );

  return (
    <>
      <SideModal
        isOpen={isOpen}
        onClose={onClose}
        title={
          mode === "create"
            ? "Создать мероприятие"
            : `Редактирование «${initialData.title}»`
        }
        actions={actions}
        onSubmit={handleSubmit}
      >
        <Input
          type="text"
          label="Название мероприятия"
          placeholder="Введите название..."
          value={formData.title}
          onChange={(value) => handleInputChange("title", value)}
          error={!!errors.title}
          description={errors.title}
        />
        <InputTime
          label="Время начала"
          value={formData.startTime}
          onChange={(value) => handleInputChange("startTime", value)}
          error={!!errors.startTime}
          description={errors.startTime}
        />
        <Select
          label="Категория"
          options={categoryOptions}
          value={formData.category}
          onChange={(value) => handleInputChange("category", value)}
          placeholder="Выберите категорию"
          error={!!errors.category}
          description={errors.category}
        />
        <Select
          label="Локация"
          options={locationOptions}
          value={formData.location}
          onChange={(value) => handleInputChange("location", value)}
          placeholder="Выберите локацию"
          error={!!errors.location}
          description={errors.location}
        />
      </SideModal>
      <Modal
        title="Мероприятие добавлено"
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        confirmText="Хорошо"
      />
    </>
  );
};
