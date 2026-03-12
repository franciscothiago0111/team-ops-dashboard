import { api } from "@/core/api/http";
import type { CreateCompanyInput } from "../_schemas/company.schema";
import type { ICompany } from "@/shared/types/company";

export const companyService = {
  async create(data: CreateCompanyInput): Promise<ICompany> {
    return await api.post<ICompany>("/companies", data);
  },
};
