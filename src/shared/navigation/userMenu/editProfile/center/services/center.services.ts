import apiClient from "@/services/api/client";
import type { UpdateCenterProfileRequest } from "./center.types";

const centerService = {
    async updateProfile(data: UpdateCenterProfileRequest) {
        try {
            const response = await apiClient.put("/centros-salud/mi-perfil", data);
            return response.data;
        } catch (error) {
            console.error("Error al actualizar el perfil del centro:", error);
            throw error;
        }
    },
};

export default centerService;