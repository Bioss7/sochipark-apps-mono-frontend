import { useState, FormEvent, useEffect } from "react";
import { Button, SideModal, Input, Modal } from "@sochipark-apps-mono-frontend/ui";

interface IDevicesFormData {
  title: string;
  ip: string;
}

interface DevicesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: IDevicesFormData) => Promise<void> | void;
  mode?: "create" | "edit";
  initialData?: any;
}

export const DevicesModal = ({
  isOpen,
  onClose,
  onSubmit,
  mode = "create",
  initialData,
}: DevicesModalProps) => {
  const [formData, setFormData] = useState<IDevicesFormData>({
    title: "",
    ip: "",
  });
  const [errors, setErrors] = useState<Record<keyof IDevicesFormData, string>>({
    title: "",
    ip: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (mode === "edit" && initialData) {
      setFormData({
        title: initialData.title || "",
        ip: initialData.ip || "",
      });
    } else {
      setFormData({
        title: "",
        ip: "",
      });
    }
    setErrors({
      title: "",
      ip: "",
    });
  }, [mode, initialData, isOpen]);

  const handleInputChange = (field: keyof IDevicesFormData, value: string) => {
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
      title: !formData.title ? "Пожалуйста, введите название устройства" : "",
      ip: !formData.ip ? "Укажите время начала устройства" : "",
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
            ? "Создать устройство"
            : `Редактирование «${initialData.title}»`
        }
        actions={actions}
        onSubmit={handleSubmit}
      >
        <Input
          type="text"
          label="Название устройства"
          placeholder="Введите название..."
          value={formData.title}
          onChange={(value) => handleInputChange("title", value)}
          error={!!errors.title}
          description={errors.title}
        />
        <Input
          type="text"
          label="IP адрес"
          placeholder="Введите название..."
          value={formData.ip}
          onChange={(value) => handleInputChange("ip", value)}
          error={!!errors.ip}
          description={errors.ip}
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
