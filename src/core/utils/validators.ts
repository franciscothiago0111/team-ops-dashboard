import { z } from "zod";

export const emailValidator = z.string().email("Email inválido");

export const passwordValidator = z
  .string()
  .min(6, "A senha deve ter no mínimo 6 caracteres");

export const cpfValidator = z
  .string()
  .regex(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, "CPF inválido");

export const phoneValidator = z
  .string()
  .regex(/^\(\d{2}\) \d{4,5}-\d{4}$/, "Telefone inválido");

export const requiredStringValidator = z.string().min(1, "Campo obrigatório");

export const urlValidator = z.string().url("URL inválida");
