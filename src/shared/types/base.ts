// Base entity interface that all domain models extend
export interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt: string;
}

// Omit common fields when creating entities
export type CreateEntityData<T extends BaseEntity> = Omit<T, "id" | "createdAt" | "updatedAt">;

// Partial update without id
export type UpdateEntityData<T extends BaseEntity> = Partial<Omit<T, "id" | "createdAt" | "updatedAt">>;

// Type for entity with required id
export type EntityWithId<T extends BaseEntity> = Required<Pick<T, "id">> & T;
