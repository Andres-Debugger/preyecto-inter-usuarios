"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPhone, faEnvelope, faGlobe, faMapMarkerAlt, faCheckSquare, faBookmark, faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import { CVData } from "@/types/cv";

interface CVCPreviewProps {
  cvData: CVData;
  ref: React.RefObject<HTMLDivElement>;
}

export default function CVCPreview({ cvData, ref }: CVCPreviewProps) {
  const { personal, contact, experience, education, languages, competencies, skills } = cvData;

  const getPhotoSrc = () => {
    if (personal.photo) return personal.photo;
    return "https://via.placeholder.com/120x120.png?text=Foto";
  };

  const fullName = `${personal.firstName} ${personal.lastName}`.trim();
  const displayName = fullName || "Nombre Apellido";

  return (
    <div
      ref={ref}
      className="cv-a4"
      style={{
        backgroundColor: "var(--color-bg)",
        color: "var(--color-text)",
        width: "794px",
        minHeight: "1123px",
        boxShadow: "0 4px 15px rgba(0,0,0,0.3)",
        display: "flex",
        flexDirection: "column",
        position: "relative",
        fontFamily: "var(--font-body)",
      }}
    >
      <div
        className="cv-header-container"
        style={{
          backgroundColor: "var(--color-text)",
          color: "var(--color-bg)",
          padding: "25px 40px",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div className="cv-top-row" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <div className="cv-photo-name" style={{ display: "flex", alignItems: "center", gap: "20px" }}>
            <img
              id="cv-out-photo"
              className="cv-photo"
              src={getPhotoSrc()}
              alt="Foto de perfil"
              style={{
                width: "120px",
                height: "120px",
                borderRadius: "50%",
                objectFit: "cover",
                backgroundColor: "var(--color-muted)",
              }}
            />
            <div className="cv-name-block" style={{ display: "flex", flexDirection: "column" }}>
              <span className="cv-firstname" style={{ fontSize: "24px", fontWeight: 300, letterSpacing: "1px" }}>
                {personal.firstName || "Nombre"}
              </span>
              <span className="cv-lastname" style={{ fontSize: "40px", fontWeight: 700, lineHeight: 1.1, textTransform: "uppercase" }}>
                {personal.lastName || "Apellido"}
              </span>
              <span className="cv-title" style={{ color: "var(--color-accent)", fontSize: "18px", fontWeight: 600, marginTop: "5px" }}>
                {personal.title || "Título Profesional"}
              </span>
            </div>
          </div>
          <div className="cv-contact" style={{ display: "flex", flexDirection: "column", gap: "8px", fontSize: "12px" }}>
            <div className="cv-contact-item" style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <FontAwesomeIcon icon={faPhone} style={{ color: "var(--color-accent)", width: "15px", textAlign: "center" }} />
              <span>{contact.phone || "Teléfono"}</span>
            </div>
            <div className="cv-contact-item" style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <FontAwesomeIcon icon={faEnvelope} style={{ color: "var(--color-accent)", width: "15px", textAlign: "center" }} />
              <span>{contact.email || "email@ejemplo.com"}</span>
            </div>
            <div className="cv-contact-item" style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <FontAwesomeIcon icon={faGlobe} style={{ color: "var(--color-accent)", width: "15px", textAlign: "center" }} />
              <span>{contact.web || "www.sitioweb.com"}</span>
            </div>
            <div className="cv-contact-item" style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <FontAwesomeIcon icon={faMapMarkerAlt} style={{ color: "var(--color-accent)", width: "15px", textAlign: "center" }} />
              <span>{contact.location || "Ciudad, País"}</span>
            </div>
          </div>
        </div>
        <div className="cv-profile-title" style={{ fontWeight: 700, fontSize: "16px", marginBottom: "10px" }}>
          Mi Perfil
        </div>
        <div className="cv-profile-text" style={{ fontSize: "12px", lineHeight: 1.5, color: "var(--color-muted)" }}>
          {personal.profile || "Describe tu perfil profesional..."}
        </div>
      </div>

      <div
        className="cv-body"
        style={{
          display: "grid",
          gridTemplateColumns: "2fr 1fr",
          gap: "20px",
          padding: "30px 40px",
          flex: 1,
        }}
      >
        <div>
          <div className="cv-section-title" style={{ backgroundColor: "var(--color-text)", color: "var(--color-bg)", textAlign: "center", padding: "5px 0", fontWeight: "bold", fontSize: "14px", marginBottom: "15px", borderRadius: "2px" }}>
            Experiencia Laboral
          </div>
          <div id="cv-out-exp">
            {experience.length > 0 ? (
              experience.map((exp) => (
                <div key={exp.id} className="cv-item" style={{ marginBottom: "15px", display: "flex", gap: "10px" }}>
                  <FontAwesomeIcon icon={faCheckSquare} className="cv-item-icon" style={{ color: "var(--color-accent)", fontSize: "12px", marginTop: "2px" }} />
                  <div className="cv-item-content" style={{ flex: 1 }}>
                    <div className="cv-item-header" style={{ display: "flex", justifyContent: "space-between", fontWeight: "bold", fontSize: "13px", marginBottom: "3px", color: "var(--color-text)" }}>
                      <span>{exp.title}</span>
                      <span>{exp.date}</span>
                    </div>
                    <div className="cv-item-desc" style={{ fontSize: "11px", lineHeight: 1.4, color: "var(--color-muted)" }}>
                      {exp.description}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div style={{ fontSize: "12px", color: "var(--color-muted)" }}>Sin experiencia agregada</div>
            )}
          </div>

          <div className="cv-section-title" style={{ backgroundColor: "var(--color-text)", color: "var(--color-bg)", textAlign: "center", padding: "5px 0", fontWeight: "bold", fontSize: "14px", marginBottom: "15px", borderRadius: "2px", marginTop: "20px" }}>
            Formación Académica
          </div>
          <div id="cv-out-edu">
            {education.length > 0 ? (
              education.map((edu) => (
                <div key={edu.id} className="cv-item" style={{ marginBottom: "15px", display: "flex", gap: "10px" }}>
                  <FontAwesomeIcon icon={faBookmark} className="cv-item-icon" style={{ color: "var(--color-accent)", fontSize: "12px", marginTop: "2px" }} />
                  <div className="cv-item-content" style={{ flex: 1 }}>
                    <div className="cv-item-header" style={{ display: "flex", justifyContent: "space-between", fontWeight: "bold", fontSize: "13px", marginBottom: "3px", color: "var(--color-text)" }}>
                      <span>{edu.title}</span>
                      <span>{edu.date}</span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div style={{ fontSize: "12px", color: "var(--color-muted)" }}>Sin formación agregada</div>
            )}
          </div>
        </div>

        <div>
          <div className="cv-section-title" style={{ backgroundColor: "var(--color-text)", color: "var(--color-bg)", textAlign: "center", padding: "5px 0", fontWeight: "bold", fontSize: "14px", marginBottom: "15px", borderRadius: "2px" }}>
            Idiomas
          </div>
          <div id="cv-out-lang">
            {languages.length > 0 ? (
              languages.map((lang) => (
                <div key={lang.id} className="cv-item" style={{ marginBottom: "8px", display: "flex", gap: "10px" }}>
                  <FontAwesomeIcon icon={faCheckCircle} className="cv-item-icon" style={{ color: "var(--color-accent)", fontSize: "14px" }} />
                  <div className="cv-item-content" style={{ fontSize: "13px", paddingLeft: "5px", fontWeight: 600, color: "var(--color-text)" }}>
                    {lang.name}
                  </div>
                </div>
              ))
            ) : (
              <div style={{ fontSize: "12px", color: "var(--color-muted)" }}>Sin idiomas agregados</div>
            )}
          </div>

          <div className="cv-section-title" style={{ backgroundColor: "var(--color-text)", color: "var(--color-bg)", textAlign: "center", padding: "5px 0", fontWeight: "bold", fontSize: "14px", marginBottom: "15px", borderRadius: "2px", marginTop: "20px" }}>
            Competencias
          </div>
          <div id="cv-out-comp">
            {competencies.length > 0 ? (
              competencies.map((comp) => {
                const percentage = (comp.level / 5) * 100;
                return (
                  <div key={comp.id} className="cv-bar-item" style={{ marginBottom: "10px", display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "12px", fontWeight: 600, color: "var(--color-text)" }}>
                    <span>{comp.name}</span>
                    <div className="cv-bar-container" style={{ width: "100px", height: "8px", backgroundColor: "var(--color-muted)", borderRadius: "4px", overflow: "hidden", display: "flex" }}>
                      <div className="cv-bar-fill" style={{ height: "100%", backgroundColor: "var(--color-accent)", width: `${percentage}%` }} />
                    </div>
                  </div>
                );
              })
            ) : (
              <div style={{ fontSize: "12px", color: "var(--color-muted)" }}>Sin competencias</div>
            )}
          </div>

          <div className="cv-section-title" style={{ backgroundColor: "var(--color-text)", color: "var(--color-bg)", textAlign: "center", padding: "5px 0", fontWeight: "bold", fontSize: "14px", marginBottom: "15px", borderRadius: "2px", marginTop: "20px" }}>
            Habilidades
          </div>
          <div id="cv-out-skill">
            {skills.length > 0 ? (
              skills.map((skill) => (
                <div key={skill.id} className="cv-dot-item" style={{ marginBottom: "10px", display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "12px", fontWeight: 600, color: "var(--color-text)" }}>
                  <span>{skill.name}</span>
                  <div className="cv-dots" style={{ display: "flex", gap: "4px" }}>
                    {Array.from({ length: 5 }, (_, i) => (
                      <div
                        key={i}
                        className="cv-dot"
                        style={{
                          width: "10px",
                          height: "10px",
                          borderRadius: "50%",
                          backgroundColor: i < skill.level ? "var(--color-accent)" : "var(--color-muted)",
                        }}
                      />
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <div style={{ fontSize: "12px", color: "var(--color-muted)" }}>Sin habilidades</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}