"use client";

import { useState, useCallback } from "react";
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
  faCamera,
} from "@fortawesome/free-solid-svg-icons";
import { useCVC } from "@/context/CVCContext";
import { useToast } from "@/components/Toast";
import { useCVData, useCVValidation } from "@/hooks/useCVData";
import { CVData, generateId, capitalizeWords } from "@/types/cv";

interface CVCFormProps {
  onDownloadPDF: () => void;
}

function SectionTitle({ title, icon }: { title: string; icon: any }) {
  return (
    <div className="flex items-center gap-2 mb-3 pb-2 border-b" style={{ borderColor: "color-mix(in srgb, var(--color-muted) 30%, transparent)" }}>
      <FontAwesomeIcon icon={icon} className="text-[var(--color-accent)] text-sm" />
      <h3 className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--color-text)" }}>
        {title}
      </h3>
    </div>
  );
}

function InputGroup({
  label,
  children,
  error,
  className = "",
  style,
}: {
  label: string;
  children: React.ReactNode;
  error?: string;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div className={`mb-3 ${className}`} style={style}>
      <label className="block text-[11px] font-medium mb-1" style={{ color: "var(--color-muted)" }}>
        {label}
      </label>
      {children}
      {error && (
        <p className="text-red-500 text-[10px] mt-1 leading-tight">{error}</p>
      )}
    </div>
  );
}

function Input({
  value,
  onChange,
  onBlur,
  placeholder,
  type = "text",
  onKeyDown,
  autoCapitalize = false,
  error = false,
}: {
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  placeholder?: string;
  type?: string;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  autoCapitalize?: boolean;
  error?: boolean;
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
      onBlur={onBlur}
      placeholder={placeholder}
      className={`w-full px-3 py-1.5 text-sm border rounded bg-white transition-all focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/20 ${
        error ? "border-red-400 focus:border-red-500" : "border-gray-200 focus:border-[var(--color-accent)]"
      }`}
      style={{ color: "var(--color-text)" }}
    />
  );
}

function Textarea({
  value,
  onChange,
  onBlur,
  placeholder,
  rows = 3,
  error = false,
}: {
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  placeholder?: string;
  rows?: number;
  error?: boolean;
}) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onBlur={onBlur}
      placeholder={placeholder}
      rows={rows}
      className={`w-full px-3 py-1.5 text-sm border rounded bg-white resize-y min-h-[60px] transition-all focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/20 font-inherit ${
        error ? "border-red-400 focus:border-red-500" : "border-gray-200 focus:border-[var(--color-accent)]"
      }`}
      style={{ color: "var(--color-text)" }}
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
    <div className="flex items-center gap-2">
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value, 10))}
        className="flex-1"
        style={{ accentColor: "var(--color-accent)" }}
      />
      <span className="text-xs font-medium w-4 text-center" style={{ color: "var(--color-muted)" }}>{value}</span>
    </div>
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
    <div className="relative bg-gray-50 p-2.5 rounded border border-gray-100 mb-2 overflow-hidden">
      <button
        onClick={() => onRemove(item.id)}
        className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-red-500 text-white flex items-center justify-center text-[8px] hover:bg-red-600 transition-colors"
      >
        <FontAwesomeIcon icon={faTimes} />
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
      className="inline-flex items-center gap-1.5 px-3 py-1 text-[11px] font-medium border border-gray-200 rounded bg-white hover:bg-[var(--color-muted)] hover:text-white transition-all mt-1"
      style={{ color: "var(--color-text)" }}
    >
      <FontAwesomeIcon icon={icon} />
      {label}
    </button>
  );
}

// --- SECTIONS ---

function PersonalInfoSection({
  data,
  updateDraft,
  errors,
  validate,
}: {
  data: CVData["personal"];
  updateDraft: (data: Partial<CVData>) => void;
  errors: Record<string, string>;
  validate: (key: string, value: string) => string | null;
}) {
  const handlePhotoChange = (value: string) => updateDraft({ personal: { ...data, photo: value } });
  const handleFirstNameChange = (value: string) => updateDraft({ personal: { ...data, firstName: value } });
  const handleLastNameChange = (value: string) => updateDraft({ personal: { ...data, lastName: value } });
  const handleTitleChange = (value: string) => updateDraft({ personal: { ...data, title: value } });
  const handleProfileChange = (value: string) => updateDraft({ personal: { ...data, profile: value } });

  return (
    <>
      <SectionTitle title="Personal Data" icon={faUser} />

      {/* Photo preview */}
      <div className="flex items-center gap-3 mb-3">
        <div
          className="w-14 h-14 rounded-full flex items-center justify-center overflow-hidden border-2 border-gray-200 flex-shrink-0"
          style={{ backgroundColor: "var(--color-surface)" }}
        >
          {data.photo ? (
            <img src={data.photo} alt="Profile" className="w-full h-full object-cover" />
          ) : (
            <FontAwesomeIcon icon={faCamera} className="text-gray-300 text-lg" />
          )}
        </div>
        <div className="flex-1">
          <InputGroup label="Photo URL (optional)" error={errors["personal.photo"]}>
            <Input
              value={data.photo}
              onChange={handlePhotoChange}
              onBlur={() => validate("personal.photo", data.photo)}
              placeholder="https://example.com/photo.jpg"
              error={!!errors["personal.photo"]}
            />
          </InputGroup>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <InputGroup label="First Name" error={errors["personal.firstName"]}>
          <Input
            value={data.firstName}
            onChange={handleFirstNameChange}
            onBlur={() => validate("personal.firstName", data.firstName)}
            placeholder="John"
            autoCapitalize
            error={!!errors["personal.firstName"]}
          />
        </InputGroup>
        <InputGroup label="Last Name" error={errors["personal.lastName"]}>
          <Input
            value={data.lastName}
            onChange={handleLastNameChange}
            onBlur={() => validate("personal.lastName", data.lastName)}
            placeholder="Doe"
            autoCapitalize
            error={!!errors["personal.lastName"]}
          />
        </InputGroup>
      </div>
      <InputGroup label="Professional Title" error={errors["personal.title"]}>
        <Input
          value={data.title}
          onChange={handleTitleChange}
          onBlur={() => validate("personal.title", data.title)}
          placeholder="Web Developer"
          error={!!errors["personal.title"]}
        />
      </InputGroup>
      <InputGroup label="Profile Description" error={errors["personal.profile"]}>
        <Textarea
          value={data.profile}
          onChange={handleProfileChange}
          onBlur={() => validate("personal.profile", data.profile)}
          placeholder="Describe your professional profile..."
          rows={3}
          error={!!errors["personal.profile"]}
        />
      </InputGroup>
    </>
  );
}

function ContactSection({
  data,
  updateDraft,
  errors,
  validate,
}: {
  data: CVData["contact"];
  updateDraft: (data: Partial<CVData>) => void;
  errors: Record<string, string>;
  validate: (key: string, value: string) => string | null;
}) {
  const handlePhoneChange = (value: string) => updateDraft({ contact: { ...data, phone: value } });
  const handleEmailChange = (value: string) => updateDraft({ contact: { ...data, email: value } });
  const handleWebChange = (value: string) => updateDraft({ contact: { ...data, web: value } });
  const handleLocationChange = (value: string) => updateDraft({ contact: { ...data, location: value } });

  return (
    <>
      <SectionTitle title="Contact" icon={faPhone} />
      <InputGroup label="Phone" error={errors["contact.phone"]}>
        <Input
          value={data.phone}
          onChange={handlePhoneChange}
          onBlur={() => validate("contact.phone", data.phone)}
          placeholder="+1 234 567 890"
          error={!!errors["contact.phone"]}
        />
      </InputGroup>
      <InputGroup label="Email" error={errors["contact.email"]}>
        <Input
          value={data.email}
          onChange={handleEmailChange}
          onBlur={() => validate("contact.email", data.email)}
          placeholder="john@example.com"
          type="email"
          error={!!errors["contact.email"]}
        />
      </InputGroup>
      <InputGroup label="Website / Portfolio" error={errors["contact.web"]}>
        <Input
          value={data.web}
          onChange={handleWebChange}
          onBlur={() => validate("contact.web", data.web)}
          placeholder="https://myportfolio.com"
          error={!!errors["contact.web"]}
        />
      </InputGroup>
      <InputGroup label="Location" error={errors["contact.location"]}>
        <Input
          value={data.location}
          onChange={handleLocationChange}
          onBlur={() => validate("contact.location", data.location)}
          placeholder="New York, USA"
          error={!!errors["contact.location"]}
        />
      </InputGroup>
    </>
  );
}

function ExperienceSection({
  data,
  updateDraft,
  errors,
}: {
  data: CVData["experience"];
  updateDraft: (data: Partial<CVData>) => void;
  errors: Record<string, string>;
}) {
  const [experiences, setExperiences] = useState(data);

  const sync = (updated: typeof experiences) => {
    setExperiences(updated);
    updateDraft({ experience: updated });
  };

  const addExp = () => sync([...experiences, { id: generateId(), title: "", date: "", description: "" }]);
  const removeExp = (id: string) => sync(experiences.filter((e) => e.id !== id));

  return (
    <>
      <SectionTitle title="Work Experience" icon={faBriefcase} />
      {experiences.map((exp, i) => (
        <DynamicItem key={exp.id} item={exp} index={i} items={experiences} setItems={setExperiences} onRemove={removeExp}
          renderFields={(item, updateField) => (
            <>
              <InputGroup label="Position & Institution" error={errors[`experience[${i}].title`]}>
                <Input value={item.title} onChange={(v) => updateField("title", v)} placeholder="Web Developer" error={!!errors[`experience[${i}].title`]} />
              </InputGroup>
              <InputGroup label="Period" error={errors[`experience[${i}].date`]}>
                <Input value={item.date} onChange={(v) => updateField("date", v)} placeholder="2020 - Presente" error={!!errors[`experience[${i}].date`]} />
              </InputGroup>
              <InputGroup label="Description" error={errors[`experience[${i}].description`]}>
                <Textarea value={item.description} onChange={(v) => updateField("description", v)} placeholder="Description of your role..." rows={2} error={!!errors[`experience[${i}].description`]} />
              </InputGroup>
            </>
          )}
        />
      ))}
      <AddButton onClick={addExp} label="Add Experience" icon={faPlus} />
    </>
  );
}

function EducationSection({
  data,
  updateDraft,
  errors,
}: {
  data: CVData["education"];
  updateDraft: (data: Partial<CVData>) => void;
  errors: Record<string, string>;
}) {
  const [educations, setEducations] = useState(data);

  const sync = (updated: typeof educations) => {
    setEducations(updated);
    updateDraft({ education: updated });
  };

  const addEdu = () => sync([...educations, { id: generateId(), title: "", date: "" }]);
  const removeEdu = (id: string) => sync(educations.filter((e) => e.id !== id));

  return (
    <>
      <SectionTitle title="Education" icon={faGraduationCap} />
      {educations.map((edu, i) => (
        <DynamicItem key={edu.id} item={edu} index={i} items={educations} setItems={setEducations} onRemove={removeEdu}
          renderFields={(item, updateField) => (
            <>
              <InputGroup label="Degree & Institution" error={errors[`education[${i}].title`]}>
                <Input value={item.title} onChange={(v) => updateField("title", v)} placeholder="Computer Science" error={!!errors[`education[${i}].title`]} />
              </InputGroup>
              <InputGroup label="Period" error={errors[`education[${i}].date`]}>
                <Input value={item.date} onChange={(v) => updateField("date", v)} placeholder="2018 - 2022" error={!!errors[`education[${i}].date`]} />
              </InputGroup>
            </>
          )}
        />
      ))}
      <AddButton onClick={addEdu} label="Add Education" icon={faPlus} />
    </>
  );
}

function LanguagesSection({
  data,
  updateDraft,
  errors,
}: {
  data: CVData["languages"];
  updateDraft: (data: Partial<CVData>) => void;
  errors: Record<string, string>;
}) {
  const [languages, setLanguages] = useState(data);

  const sync = (updated: typeof languages) => {
    setLanguages(updated);
    updateDraft({ languages: updated });
  };

  const addLang = () => sync([...languages, { id: generateId(), name: "" }]);
  const removeLang = (id: string) => sync(languages.filter((l) => l.id !== id));

  return (
    <>
      <SectionTitle title="Languages" icon={faLanguage} />
      {languages.map((lang, i) => (
        <DynamicItem key={lang.id} item={lang} index={i} items={languages} setItems={setLanguages} onRemove={removeLang}
          renderFields={(item, updateField) => (
            <InputGroup label="Language" error={errors[`languages[${i}].name`]}>
              <Input value={item.name} onChange={(v) => updateField("name", v)} placeholder="English (Advanced)" autoCapitalize error={!!errors[`languages[${i}].name`]} />
            </InputGroup>
          )}
        />
      ))}
      <AddButton onClick={addLang} label="Add Language" icon={faPlus} />
    </>
  );
}

function CompetenciesSection({
  data,
  updateDraft,
  errors,
}: {
  data: CVData["competencies"];
  updateDraft: (data: Partial<CVData>) => void;
  errors: Record<string, string>;
}) {
  const [competencies, setCompetencies] = useState(data);

  const sync = (updated: typeof competencies) => {
    setCompetencies(updated);
    updateDraft({ competencies: updated });
  };

  const addComp = () => sync([...competencies, { id: generateId(), name: "", level: 4 }]);
  const removeComp = (id: string) => sync(competencies.filter((c) => c.id !== id));

  return (
    <>
      <SectionTitle title="Software Skills (1-5)" icon={faCogs} />
      {competencies.map((comp, i) => (
        <DynamicItem key={comp.id} item={comp} index={i} items={competencies} setItems={setCompetencies} onRemove={removeComp}
          renderFields={(item, updateField) => (
            <>
              <InputGroup label="Software" error={errors[`competencies[${i}].name`]}>
                <Input value={item.name} onChange={(v) => updateField("name", v)} placeholder="React" autoCapitalize error={!!errors[`competencies[${i}].name`]} />
              </InputGroup>
              <InputGroup label="Level">
                <RangeInput value={item.level} onChange={(v) => updateField("level", v)} min={1} max={5} />
              </InputGroup>
            </>
          )}
        />
      ))}
      <AddButton onClick={addComp} label="Add Competency" icon={faPlus} />
    </>
  );
}

function SkillsSection({
  data,
  updateDraft,
  errors,
}: {
  data: CVData["skills"];
  updateDraft: (data: Partial<CVData>) => void;
  errors: Record<string, string>;
}) {
  const [skills, setSkills] = useState(data);

  const sync = (updated: typeof skills) => {
    setSkills(updated);
    updateDraft({ skills: updated });
  };

  const addSkill = () => sync([...skills, { id: generateId(), name: "", level: 5 }]);
  const removeSkill = (id: string) => sync(skills.filter((s) => s.id !== id));

  return (
    <>
      <SectionTitle title="Soft Skills (1-5)" icon={faStar} />
      {skills.map((skill, i) => (
        <DynamicItem key={skill.id} item={skill} index={i} items={skills} setItems={setSkills} onRemove={removeSkill}
          renderFields={(item, updateField) => (
            <>
              <InputGroup label="Skill" error={errors[`skills[${i}].name`]}>
                <Input value={item.name} onChange={(v) => updateField("name", v)} placeholder="Leadership" autoCapitalize error={!!errors[`skills[${i}].name`]} />
              </InputGroup>
              <InputGroup label="Level">
                <RangeInput value={item.level} onChange={(v) => updateField("level", v)} min={1} max={5} />
              </InputGroup>
            </>
          )}
        />
      ))}
      <AddButton onClick={addSkill} label="Add Skill" icon={faPlus} />
    </>
  );
}

// --- MAIN FORM ---

export default function CVCForm({ onDownloadPDF }: CVCFormProps) {
  const { cvData, draftData, hasDraft, updateDraft, applyDraft, resetDraft } = useCVC();
  const { addToast } = useToast();
  const { errors, validateAll, validate, clearErrors } = useCVValidation();

  const currentData = draftData || cvData;

  const handleApply = () => {
    if (!validateAll(currentData)) {
      addToast("Please fix the errors before applying", "error");
      return;
    }
    applyDraft();
    clearErrors();
    addToast("CV changes applied", "success");
  };

  const handleReset = () => {
    resetDraft();
    clearErrors();
    addToast("Changes discarded", "info");
  };

  return (
    <div className="form-section border p-5 rounded-lg" style={{ borderColor: "color-mix(in srgb, var(--color-muted) 30%, transparent)", backgroundColor: "var(--color-surface)" }}>
      <h2 className="text-base font-semibold mb-4" style={{ color: "var(--color-accent)" }}>Configure your CV</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-6">
        {/* Left column - Static fields */}
        <div className="space-y-5">
          <PersonalInfoSection data={currentData.personal} updateDraft={updateDraft} errors={errors} validate={validate} />
          <ContactSection data={currentData.contact} updateDraft={updateDraft} errors={errors} validate={validate} />
        </div>

        {/* Right column - Dynamic subforms */}
        <div className="space-y-5">
          <ExperienceSection data={currentData.experience} updateDraft={updateDraft} errors={errors} />
          <EducationSection data={currentData.education} updateDraft={updateDraft} errors={errors} />
        </div>
      </div>

      {/* Full-width bottom sections */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 pt-5 border-t" style={{ borderColor: "color-mix(in srgb, var(--color-muted) 30%, transparent)" }}>
        <div className="min-w-0">
          <LanguagesSection data={currentData.languages} updateDraft={updateDraft} errors={errors} />
        </div>
        <div className="min-w-0">
          <CompetenciesSection data={currentData.competencies} updateDraft={updateDraft} errors={errors} />
        </div>
        <div className="min-w-0">
          <SkillsSection data={currentData.skills} updateDraft={updateDraft} errors={errors} />
        </div>
      </div>

      {/* Action bar */}
      <div className="flex flex-wrap items-center gap-2 mt-5 pt-4 border-t" style={{ borderColor: "color-mix(in srgb, var(--color-muted) 30%, transparent)" }}>
        <button
          onClick={onDownloadPDF}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg text-white transition-opacity hover:opacity-90"
          style={{ backgroundColor: "var(--color-accent)" }}
        >
          <FontAwesomeIcon icon={faFilePdf} />
          Download PDF
        </button>
        {hasDraft && (
          <>
            <button
              onClick={handleReset}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium border rounded-lg transition-colors hover:opacity-80"
              style={{ borderColor: "var(--color-muted)", color: "var(--color-text)" }}
            >
              <FontAwesomeIcon icon={faTimes} />
              Reset
            </button>
            <button
              onClick={handleApply}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg text-white transition-colors hover:opacity-90"
              style={{ backgroundColor: "var(--color-accent)" }}
            >
              <FontAwesomeIcon icon={faCheck} />
              Apply Changes
            </button>
          </>
        )}
      </div>
    </div>
  );
}
