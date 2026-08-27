/**
 * Panel visual utilizado en las pantallas públicas de autenticación.
 *
 * La imagen se obtiene desde la carpeta `public`, por lo que no requiere
 * importación mediante TypeScript o Vite.
 */

const AUTH_HERO_IMAGE = "/assets/images/NNAS.jpg";

export function AuthHero() {
  return (
    <section
      aria-label="Presentación de Mesa de Ayuda 2.0"
      className={[
        "relative hidden min-h-0 overflow-hidden bg-slate-950",
        "lg:flex lg:flex-col lg:justify-end",
      ].join(" ")}
    >
      {/* Imagen institucional */}
      <img
        src={AUTH_HERO_IMAGE}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-cover"
        style={{
          objectPosition: "center 48%",
        }}
      />

      {/* Oscurecimiento general para mejorar el contraste */}
      <div aria-hidden="true" className="absolute inset-0 bg-slate-950/35" />

      {/* Degradado inferior, similar al diseño de Figma */}
      <div
        aria-hidden="true"
        className={[
          "absolute inset-0",
          "bg-gradient-to-b",
          "from-slate-950/10",
          "via-slate-950/30",
          "to-slate-950/95",
        ].join(" ")}
      />

      {/* Oscurecimiento lateral sutil */}
      <div
        aria-hidden="true"
        className={[
          "absolute inset-0",
          "bg-gradient-to-r",
          "from-slate-950/25",
          "via-transparent",
          "to-slate-950/10",
        ].join(" ")}
      />

      {/* Contenido */}
      <div
        className={[
          "relative z-10 w-full",
          "px-8 pb-12",
          "xl:px-14 xl:pb-14",
          "2xl:px-16 2xl:pb-16",
        ].join(" ")}
      >
        <div className="max-w-[640px]">
          <h1
            className={[
              "m-0 text-white",
              "text-[34px] leading-[1.12]",
              "font-[var(--font-weight-bold)]",
              "tracking-[-0.025em]",
              "xl:text-[40px]",
            ].join(" ")}
          >
            Mesa de Ayuda 2.0
          </h1>

          <p
            className={[
              "mt-5 max-w-[620px]",
              "text-[15px] leading-7",
              "font-[var(--font-weight-regular)]",
              "text-white/90",
              "xl:text-[16px]",
            ].join(" ")}
          >
            Una plataforma para registrar, organizar y dar seguimiento a las solicitudes de atención
            de manera segura y eficiente.
          </p>

          <div aria-hidden="true" className="mt-5 h-px w-full bg-white/20" />
        </div>
      </div>
    </section>
  );
}
