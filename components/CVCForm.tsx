"use client";

import { useState, useRef, useCallback } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faTimes,
  faFilePdf,
  faUser,
  faPhone,
  faEnvelope,
  faGlobe,
  faMapMarkerAlt,
  faBriefcase,
  faGraduationCap,
  faLanguage,
  faCogs,
  faStar,
  faCheck,
} from "@fortawesome/free-solid-svg-icons";
import { useCVC } from "@/context/CVCContext";
import { useToast } from "@/components/Toast";
import { useCVData } from "@/hooks/useCVData";
import { CVData, generateId, capitalizeWords } from "@/types/cv";

interface CVCFormProps {
  onDownloadPDF: () => void;
}

function SectionTitle({ title, icon }: { title: string; icon: any }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "1.5rem", marginBottom: "0.5rem" }}>
      <FontAwesomeIcon icon={icon} style={{ color: "var(--color-accent)" }} />
      <h3 style={{ color: "var(--color-text)", fontSize: "1.1rem", borderBottom: "1px solid var(--color-surface)", paddingBottom: "0.3rem" }}>
        {title}
      </h3>
    </div>
  );
}

function InputGroup({ label, children, className = "", style }: { label: string; children: React.ReactNode; className?: string; style?: React.CSSProperties }) {
  return (
    <div className={`input-group ${className}`} style={{ marginBottom: "1rem", ...style }}>
      <label style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--color-muted)", marginBottom: "0.3rem", display: "block" }}>
        {label}
      </label>
      {children}
    </div>
  );
}

function Input({
  value,
  onChange,
  placeholder,
  type = "text",
  onKeyDown,
  autoCapitalize = false,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  autoCapitalize?: boolean;
}) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value;
    if (autoCapitalize) {
      val = capitalizeWords(val);
    }
    onChange(val);
  };

  return (
    <input
      type={type}
      value={value}
      onChange={handleChange}
      onKeyDown={onKeyDown}
      placeholder={placeholder}
      style={{
        padding: "0.6rem",
        border: "1px solid var(--color-muted)",
        borderRadius: "4px",
        backgroundColor: "#fff",
        color: "var(--color-text)",
        width: "100%",
        transition: "border-color 0.2s, box-shadow 0.2s",
        outline: "none",
      }}
      onFocus={(e) => {
        e.target.style.borderColor = "var(--color-accent)";
        e.target.style.boxShadow = "0 0 0 2px rgba(185, 138, 90, 0.2)";
      }}
      onBlur={(e) => {
        e.target.style.borderColor = "var(--color-muted)";
        e.target.style.boxShadow = "none";
      }}
    />
  );
}

function Textarea({
  value,
  onChange,
  placeholder,
  rows = 4,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
}) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      style={{
        padding: "0.6rem",
        border: "1px solid var(--color-muted)",
        borderRadius: "4px",
        backgroundColor: "#fff",
        color: "var(--color-text)",
        width: "100%",
        resize: "vertical",
        minHeight: "80px",
        transition: "border-color 0.2s, box-shadow 0.2s",
        outline: "none",
        fontFamily: "inherit",
      }}
      onFocus={(e) => {
        e.target.style.borderColor = "var(--color-accent)";
        e.target.style.boxShadow = "0 0 0 2px rgba(185, 138, 90, 0.2)";
      }}
      onBlur={(e) => {
        e.target.style.borderColor = "var(--color-muted)";
        e.target.style.boxShadow = "none";
      }}
    />
  );
}

function RangeInput({
  value,
  onChange,
  min = 1,
  max = 5,
}: {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
}) {
  return (
    <input
      type="range"
      min={min}
      max={max}
      value={value}
      onChange={(e) => onChange(parseInt(e.target.value, 10))}
      style={{
        accentColor: "var(--color-accent)",
        width: "100%",
      }}
    />
  );
}

function DynamicItem<T extends { id: string }>({
  item,
  index,
  items,
  setItems,
  renderFields,
  onRemove,
}: {
  item: T;
  index: number;
  items: T[];
  setItems: React.Dispatch<React.SetStateAction<T[]>>;
  renderFields: (item: T, updateField: (field: keyof T, value: any) => void) => React.ReactNode;
  onRemove: (id: string) => void;
}) {
  const updateField = useCallback((field: keyof T, value: any) => {
    setItems((prev) => prev.map((i) => (i.id === item.id ? { ...i, [field]: value } : i)));
  }, [item.id, setItems]);

  return (
    <div
      className="dynamic-item"
      style={{
        backgroundColor: "var(--color-surface)",
        padding: "1rem",
        borderRadius: "6px",
        marginBottom: "1rem",
        position: "relative",
      }}
    >
      <button
        className="btn-remove"
        onClick={() => onRemove(item.id)}
        style={{
          position: "absolute",
          top: "0.5rem",
          right: "0.5rem",
          background: "#ff4d4d",
          color: "white",
          border: "none",
          borderRadius: "50%",
          width: "24px",
          height: "24px",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <FontAwesomeIcon icon={faTimes} style={{ fontSize: "10px" }} />
      </button>
      {renderFields(item, updateField)}
    </div>
  );
}

function AddButton({ onClick, label, icon }: { onClick: () => void; label: string; icon: any }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="btn"
      style={{
        backgroundColor: "var(--color-surface)",
        color: "var(--color-text)",
        border: "1px solid var(--color-muted)",
        padding: "0.5rem 1rem",
        borderRadius: "4px",
        cursor: "pointer",
        fontWeight: 600,
        transition: "all 0.2s",
        marginTop: "0.5rem",
        display: "inline-flex",
        alignItems: "center",
        gap: "0.5rem",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = "var(--color-muted)";
        e.currentTarget.style.color = "#fff";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = "var(--color-surface)";
        e.currentTarget.style.color = "var(--color-text)";
      }}
    >
      <FontAwesomeIcon icon={icon} />
      {label}
    </button>
  );
}

function PersonalInfoSection({
  data,
  updateDraft,
}: {
  data: CVData["personal"];
  updateDraft: (data: Partial<CVData>) => void;
}) {
  const handlePhotoChange = (value: string) => updateDraft({ personal: { ...data, photo: value } });
  const handleFirstNameChange = (value: string) => updateDraft({ personal: { ...data, firstName: value } });
  const handleLastNameChange = (value: string) => updateDraft({ personal: { ...data, lastName: value } });
  const handleTitleChange = (value: string) => updateDraft({ personal: { ...data, title: value } });
  const handleProfileChange = (value: string) => updateDraft({ personal: { ...data, profile: value } });

  return (
    <>
      <SectionTitle title="Datos Personales" icon={faUser} />
      <InputGroup label="Foto URL (opcional)">
        <Input value={data.photo} onChange={handlePhotoChange} placeholder="https://ejemplo.com/mifoto.jpg" />
      </InputGroup>
      <div style={{ display: "flex", gap: "1rem" }}>
        <InputGroup label="Nombres" style={{ flex: 1 }}>
          <Input
            value={data.firstName}
            onChange={handleFirstNameChange}
            placeholder="Ej. alejandro"
            autoCapitalize
          />
        </InputGroup>
        <InputGroup label="Apellidos" style={{ flex: 1 }}>
          <Input
            value={data.lastName}
            onChange={handleLastNameChange}
            placeholder="Ej. TORRES"
            autoCapitalize
          />
        </InputGroup>
      </div>
      <InputGroup label="Profesión / Título">
        <Input value={data.title} onChange={handleTitleChange} placeholder="Programador web" />
      </InputGroup>
      <InputGroup label="Perfil (Descripción)">
        <Textarea value={data.profile} onChange={handleProfileChange} placeholder="Describe tu perfil profesional..." />
      </InputGroup>
    </>
  );
}

function ContactSection({
  data,
  updateDraft,
}: {
  data: CVData["contact"];
  updateDraft: (data: Partial<CVData>) => void;
}) {
  const handlePhoneChange = (value: string) => updateDraft({ contact: { ...data, phone: value } });
  const handleEmailChange = (value: string) => updateDraft({ contact: { ...data, email: value } });
  const handleWebChange = (value: string) => updateDraft({ contact: { ...data, web: value } });
  const handleLocationChange = (value: string) => updateDraft({ contact: { ...data, location: value } });

  return (
    <>
      <SectionTitle title="Contacto" icon={faPhone} />
      <InputGroup label="Teléfono">
        <Input value={data.phone} onChange={handlePhoneChange} placeholder="9567 - 2315 - 63" />
      </InputGroup>
      <InputGroup label="Email">
        <Input value={data.email} onChange={handleEmailChange} placeholder="hola@sitioincreible.com.ar" type="email" />
      </InputGroup>
      <InputGroup label="Web / Portfolio">
        <Input value={data.web} onChange={handleWebChange} placeholder="www.unsitioincreible.com" />
      </InputGroup>
      <InputGroup label="Ubicación">
        <Input value={data.location} onChange={handleLocationChange} placeholder="123 Calle Cualquiera, Ciudad, País" />
      </InputGroup>
    </>
  );
}

function ExperienceSection({
  data,
  updateDraft,
}: {
  data: CVData["experience"];
  updateDraft: (data: Partial<CVData>) => void;
}) {
  const [experiences, setExperiences] = useState(data);

  const addExp = () => {
    const newExp = { id: generateId(), title: "", date: "", description: "" };
    const updated = [...experiences, newExp];
    setExperiences(updated);
    updateDraft({ experience: updated });
  };

  const removeExp = (id: string) => {
    const updated = experiences.filter((e) => e.id !== id);
    setExperiences(updated);
    updateDraft({ experience: updated });
  };

  const updateExp = (id: string, field: keyof typeof experiences[0], value: any) => {
    const updated = experiences.map((e) => (e.id === id ? { ...e, [field]: value } : e));
    setExperiences(updated);
    updateDraft({ experience: updated });
  };

  return (
    <>
      <SectionTitle title="Experiencia Laboral" icon={faBriefcase} />
      {experiences.map((exp, index) => (
        <DynamicItem
          key={exp.id}
          item={exp}
          index={index}
          items={experiences}
          setItems={setExperiences}
          onRemove={removeExp}
          renderFields={(item, updateField) => (
            <>
              <InputGroup label="Puesto e Institución">
                <Input value={item.title} onChange={(v) => updateField("title", v)} placeholder="Diseñador web Consultas" />
              </InputGroup>
              <InputGroup label="Periodo">
                <Input value={item.date} onChange={(v) => updateField("date", v)} placeholder="2020 - 2022" />
              </InputGroup>
              <InputGroup label="Descripción">
                <Textarea value={item.description} onChange={(v) => updateField("description", v)} placeholder="Lorem ipsum dolor sit amet..." />
              </InputGroup>
            </>
          )}
        />
      ))}
      <AddButton onClick={addExp} label="Añadir Experiencia" icon={faPlus} />
    </>
  );
}

function EducationSection({
  data,
  updateDraft,
}: {
  data: CVData["education"];
  updateDraft: (data: Partial<CVData>) => void;
}) {
  const [educations, setEducations] = useState(data);

  const addEdu = () => {
    const newEdu = { id: generateId(), title: "", date: "" };
    const updated = [...educations, newEdu];
    setEducations(updated);
    updateDraft({ education: updated });
  };

  const removeEdu = (id: string) => {
    const updated = educations.filter((e) => e.id !== id);
    setEducations(updated);
    updateDraft({ education: updated });
  };

  const updateEdu = (id: string, field: keyof typeof educations[0], value: any) => {
    const updated = educations.map((e) => (e.id === id ? { ...e, [field]: value } : e));
    setEducations(updated);
    updateDraft({ education: updated });
  };

  return (
    <>
      <SectionTitle title="Formación Académica" icon={faGraduationCap} />
      {educations.map((edu, index) => (
        <DynamicItem
          key={edu.id}
          item={edu}
          index={index}
          items={educations}
          setItems={setEducations}
          onRemove={removeEdu}
          renderFields={(item, updateField) => (
            <>
              <InputGroup label="Grado e Institución">
                <Input value={item.title} onChange={(v) => updateField("title", v)} placeholder="Universidad, El maestro" />
              </InputGroup>
              <InputGroup label="Periodo">
                <Input value={item.date} onChange={(v) => updateField("date", v)} placeholder="2008 - 2012" />
              </InputGroup>
            </>
          )}
        />
      ))}
      <AddButton onClick={addEdu} label="Añadir Formación" icon={faPlus} />
    </>
  );
}

function LanguagesSection({
  data,
  updateDraft,
}: {
  data: CVData["languages"];
  updateDraft: (data: Partial<CVData>) => void;
}) {
  const [languages, setLanguages] = useState(data);

  const addLang = () => {
    const newLang = { id: generateId(), name: "" };
    const updated = [...languages, newLang];
    setLanguages(updated);
    updateDraft({ languages: updated });
  };

  const removeLang = (id: string) => {
    const updated = languages.filter((l) => l.id !== id);
    setLanguages(updated);
    updateDraft({ languages: updated });
  };

  const updateLang = (id: string, field: keyof typeof languages[0], value: any) => {
    const updated = languages.map((l) => (l.id === id ? { ...l, [field]: value } : l));
    setLanguages(updated);
    updateDraft({ languages: updated });
  };

  return (
    <>
      <SectionTitle title="Idiomas" icon={faLanguage} />
      {languages.map((lang, index) => (
        <DynamicItem
          key={lang.id}
          item={lang}
          index={index}
          items={languages}
          setItems={setLanguages}
          onRemove={removeLang}
          renderFields={(item, updateField) => (
            <InputGroup label="Idioma">
              <Input value={item.name} onChange={(v) => updateField("name", v)} placeholder="Ej. Inglés (Avanzado)" autoCapitalize />
            </InputGroup>
          )}
        />
      ))}
      <AddButton onClick={addLang} label="Añadir Idioma" icon={faPlus} />
    </>
  );
}

function CompetenciesSection({
  data,
  updateDraft,
}: {
  data: CVData["competencies"];
  updateDraft: (data: Partial<CVData>) => void;
}) {
  const [competencies, setCompetencies] = useState(data);

  const addComp = () => {
    const newComp = { id: generateId(), name: "", level: 4 };
    const updated = [...competencies, newComp];
    setCompetencies(updated);
    updateDraft({ competencies: updated });
  };

  const removeComp = (id: string) => {
    const updated = competencies.filter((c) => c.id !== id);
    setCompetencies(updated);
    updateDraft({ competencies: updated });
  };

  const updateComp = (id: string, field: keyof typeof competencies[0], value: any) => {
    const updated = competencies.map((c) => (c.id === id ? { ...c, [field]: value } : c));
    setCompetencies(updated);
    updateDraft({ competencies: updated });
  };

  return (
    <>
      <SectionTitle title="Competencias (Software - Nivel 1 a 5)" icon={faCogs} />
      {competencies.map((comp, index) => (
        <DynamicItem
          key={comp.id}
          item={comp}
          index={index}
          items={competencies}
          setItems={setCompetencies}
          onRemove={removeComp}
          renderFields={(item, updateField) => (
            <>
              <InputGroup label="Software">
                <Input value={item.name} onChange={(v) => updateField("name", v)} placeholder="HTML / CSS" autoCapitalize />
              </InputGroup>
              <InputGroup label="Nivel (1 a 5)">
                <RangeInput value={item.level} onChange={(v) => updateField("level", v)} min={1} max={5} />
              </InputGroup>
            </>
          )}
        />
      ))}
      <AddButton onClick={addComp} label="Añadir Competencia" icon={faPlus} />
    </>
  );
}

function SkillsSection({
  data,
  updateDraft,
}: {
  data: CVData["skills"];
  updateDraft: (data: Partial<CVData>) => void;
}) {
  const [skills, setSkills] = useState(data);

  const addSkill = () => {
    const newSkill = { id: generateId(), name: "", level: 5 };
    const updated = [...skills, newSkill];
    setSkills(updated);
    updateDraft({ skills: updated });
  };

  const removeSkill = (id: string) => {
    const updated = skills.filter((s) => s.id !== id);
    setSkills(updated);
    updateDraft({ skills: updated });
  };

  const updateSkill = (id: string, field: keyof typeof skills[0], value: any) => {
    const updated = skills.map((s) => (s.id === id ? { ...s, [field]: value } : s));
    setSkills(updated);
    updateDraft({ skills: updated });
  };

  return (
    <>
      <SectionTitle title="Habilidades (Nivel 1 a 5)" icon={faStar} />
      {skills.map((skill, index) => (
        <DynamicItem
          key={skill.id}
          item={skill}
          index={index}
          items={skills}
          setItems={setSkills}
          onRemove={removeSkill}
          renderFields={(item, updateField) => (
            <>
              <InputGroup label="Habilidad">
                <Input value={item.name} onChange={(v) => updateField("name", v)} placeholder="Liderazgo" autoCapitalize />
              </InputGroup>
              <InputGroup label="Nivel (1 a 5)">
                <RangeInput value={item.level} onChange={(v) => updateField("level", v)} min={1} max={5} />
              </InputGroup>
            </>
          )}
        />
      ))}
      <AddButton onClick={addSkill} label="Añadir Habilidad" icon={faPlus} />
    </>
  );
}

export default function CVCForm({ onDownloadPDF }: CVCFormProps) {
  const { cvData, draftData, hasDraft, updateDraft, applyDraft, resetDraft } = useCVC();
  const { addToast } = useToast();

  const currentData = draftData || cvData;

  const handleApply = () => {
    applyDraft();
    addToast("Cambios aplicados al CV", "success");
  };

  const handleReset = () => {
    resetDraft();
    addToast("Cambios descartados", "info");
  };

  return (
    <div className="form-section" style={{ padding: "2rem", overflowY: "auto", borderRight: "2px solid var(--color-surface)", flex: 1 }}>
      <h2 style={{ color: "var(--color-accent)", marginBottom: "1.5rem" }}>Configura tu CV</h2>

      <PersonalInfoSection data={currentData.personal} updateDraft={updateDraft} />
      <ContactSection data={currentData.contact} updateDraft={updateDraft} />
      <ExperienceSection data={currentData.experience} updateDraft={updateDraft} />
      <EducationSection data={currentData.education} updateDraft={updateDraft} />
      <LanguagesSection data={currentData.languages} updateDraft={updateDraft} />
      <CompetenciesSection data={currentData.competencies} updateDraft={updateDraft} />
      <SkillsSection data={currentData.skills} updateDraft={updateDraft} />

      <div style={{ display: "flex", gap: "0.5rem", marginTop: "2rem", flexWrap: "wrap" }}>
        {hasDraft && (
          <>
            <button
              onClick={handleReset}
              style={{
                backgroundColor: "var(--color-surface)",
                color: "var(--color-text)",
                border: "1px solid var(--color-muted)",
                padding: "0.5rem 1rem",
                borderRadius: "4px",
                cursor: "pointer",
                fontWeight: 600,
                transition: "all 0.2s",
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "var(--color-muted)";
                e.currentTarget.style.color = "#fff";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "var(--color-surface)";
                e.currentTarget.style.color = "var(--color-text)";
              }}
            >
              <FontAwesomeIcon icon={faTimes} /> Reset
            </button>
            <button
              onClick={handleApply}
              style={{
                backgroundColor: "var(--color-accent)",
                color: "#fff",
                border: "none",
                padding: "0.5rem 1rem",
                borderRadius: "4px",
                cursor: "pointer",
                fontWeight: 600,
                transition: "all 0.2s",
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "#9d7348"; }}
            >
              <FontAwesomeIcon icon={faCheck} /> Aplicar Cambios
            </button>
          </>
        )}
        <button
          onClick={onDownloadPDF}
          style={{
            backgroundColor: "var(--color-accent)",
            color: "#fff",
            border: "none",
            padding: "1rem",
            borderRadius: "4px",
            cursor: "pointer",
            fontWeight: 600,
            fontSize: "1.1rem",
            width: "100%",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "0.5rem",
            marginTop: "1rem",
            transition: "all 0.2s",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "#9d7348"; }}
        >
          <FontAwesomeIcon icon={faFilePdf} /> Descargar CV en PDF
        </button>
      </div>
    </div>
  );
}