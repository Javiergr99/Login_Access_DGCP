import { describe, expect, it } from "vitest";

import { ApiError } from "@/api/api-error";
import { mapAccessEntryError } from "@/features/access/model/access-entry-error";

describe("access entry error", () => {
  it("traduce REDIRECT_URL_NOT_ALLOWED a una instrucción de configuración", () => {
    const error = new ApiError({
      code: "REDIRECT_URL_NOT_ALLOWED",
      message: "URL de redirección no permitida.",
      status: 403,
    });

    expect(mapAccessEntryError(error, "http://127.0.0.1:5173/app/dashboard")).toEqual(
      expect.objectContaining({
        title: "Destino no autorizado por auth_service",
        destination: "http://127.0.0.1:5173/app/dashboard",
      }),
    );
  });
});
