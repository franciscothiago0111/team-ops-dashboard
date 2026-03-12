import { api } from "@/core/api/http";
import { CreateCompanyInput } from "../_schemas/company.schema";
import { Company } from "@/shared/types/company";

export const companyService = {
  async create(data: CreateCompanyInput): Promise<Company> {
    return await api.post<Company>("/companies", data);
  },
};
