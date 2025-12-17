import { CategoriesService } from '@/api/generated/services/CategoriesService';
import type { CreateCategoryDto } from '@/api/generated/models/CreateCategoryDto';
import type { UpdateCategoryDto } from '@/api/generated/models/UpdateCategoryDto';
import { unwrapData } from './http';

export async function listCategories(params: {
  sortBy?: 'name' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
  type?: 'income' | 'expense';
  search?: string;
} = {}) {
  const response = await CategoriesService.categoriesControllerFindAll(
    params.sortBy,
    params.sortOrder,
    params.type,
    params.search
  );
  return unwrapData<unknown>(response);
}

export async function createCategory(data: CreateCategoryDto) {
  const response = await CategoriesService.categoriesControllerCreate(data);
  return unwrapData<unknown>(response);
}

export async function getCategory(id: string) {
  const response = await CategoriesService.categoriesControllerFindOne(id);
  return unwrapData<unknown>(response);
}

export async function updateCategory(id: string, data: UpdateCategoryDto) {
  const response = await CategoriesService.categoriesControllerUpdate(id, data);
  return unwrapData<unknown>(response);
}

export async function deleteCategory(id: string) {
  const response = await CategoriesService.categoriesControllerRemove(id);
  return unwrapData<unknown>(response);
}
