"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Building2, Package, AlertCircle, FileText, Check } from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@myhrvold/ui/card";
import { Button } from "@myhrvold/ui/button";
import { Input } from "@myhrvold/ui/input";
import { WizardStepper, WizardActions } from "@myhrvold/ui/wizard-stepper";

const steps = [
  { id: 1, title: "Grunninfo", description: "Saksnummer og type" },
  { id: 2, title: "Kunde", description: "Velg kunde" },
  { id: 3, title: "Produkt", description: "Produktinformasjon" },
  { id: 4, title: "Problem", description: "Beskrivelse" },
  { id: 5, title: "Oppsummering", description: "Bekreft og opprett" },
];

const claimTypes = [
  { id: "warranty", label: "Garanti", description: "Produkt har fabrikasjonsfeil" },
  { id: "goodwill", label: "Godvilje", description: "Utenfor garanti, men vi ønsker å hjelpe" },
  { id: "transport", label: "Transport", description: "Skade under transport" },
  { id: "installation", label: "Installasjon", description: "Feil ved installasjon" },
];

const priorityLevels = [
  { id: "low", label: "Lav", color: "bg-gray-100 text-gray-700" },
  { id: "medium", label: "Medium", color: "bg-blue-100 text-blue-700" },
  { id: "high", label: "Høy", color: "bg-orange-100 text-orange-700" },
  { id: "urgent", label: "Haster", color: "bg-red-100 text-red-700" },
];

// Mock data
const mockCustomers = [
  { id: "1", name: "Hotel Bristol", orgNumber: "123456789", address: "Karl Johans gate 31, Oslo" },
  { id: "2", name: "Scandic Hotel Oslo", orgNumber: "987654321", address: "Holbergs gate 30, Oslo" },
  { id: "3", name: "Kantina AS", orgNumber: "456789123", address: "Storgata 1, Bergen" },
  { id: "4", name: "Restaurant Fjord", orgNumber: "789123456", address: "Havnepromenaden 5, Stavanger" },
];

interface ClaimFormData {
  title: string;
  claimType: string;
  priority: string;
  customerId: string;
  customerName: string;
  productName: string;
  serialNumber: string;
  purchaseDate: string;
  description: string;
  attachments: File[];
}

export default function NewClaimPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [customerSearch, setCustomerSearch] = useState("");

  const [formData, setFormData] = useState<ClaimFormData>({
    title: "",
    claimType: "",
    priority: "medium",
    customerId: "",
    customerName: "",
    productName: "",
    serialNumber: "",
    purchaseDate: "",
    description: "",
    attachments: [],
  });

  const updateFormData = (field: keyof ClaimFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const filteredCustomers = mockCustomers.filter((c) =>
    c.name.toLowerCase().includes(customerSearch.toLowerCase()) ||
    c.orgNumber.includes(customerSearch)
  );

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return formData.title.length > 0 && formData.claimType.length > 0;
      case 2:
        return formData.customerId.length > 0;
      case 3:
        return formData.productName.length > 0;
      case 4:
        return formData.description.length > 10;
      case 5:
        return true;
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (currentStep < 5 && canProceed()) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    // Simuler API-kall
    await new Promise((resolve) => setTimeout(resolve, 1500));
    // Redirect til den nye reklamasjonen
    router.push("/claims");
  };

  const selectCustomer = (customer: typeof mockCustomers[0]) => {
    updateFormData("customerId", customer.id);
    updateFormData("customerName", customer.name);
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/claims">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Tilbake
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Ny reklamasjon</h1>
          <p className="text-gray-600">Fyll ut skjemaet for å opprette en ny sak</p>
        </div>
      </div>

      {/* Stepper */}
      <WizardStepper
        steps={steps}
        currentStep={currentStep}
        onStepClick={(step) => step < currentStep && setCurrentStep(step)}
      />

      {/* Step Content */}
      <Card>
        <CardContent className="pt-6">
          {/* Step 1: Grunninfo */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Tittel på saken *
                </label>
                <Input
                  type="text"
                  placeholder="Kort beskrivelse av problemet"
                  value={formData.title}
                  onChange={(e) => updateFormData("title", e.target.value)}
                  className="mt-1"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Type reklamasjon *
                </label>
                <div className="grid gap-3 sm:grid-cols-2">
                  {claimTypes.map((type) => (
                    <button
                      key={type.id}
                      type="button"
                      onClick={() => updateFormData("claimType", type.id)}
                      className={`rounded-lg border-2 p-4 text-left transition-colors ${
                        formData.claimType === type.id
                          ? "border-teal-600 bg-teal-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <p className="font-medium">{type.label}</p>
                      <p className="mt-1 text-sm text-gray-500">{type.description}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Prioritet
                </label>
                <div className="flex flex-wrap gap-2">
                  {priorityLevels.map((level) => (
                    <button
                      key={level.id}
                      type="button"
                      onClick={() => updateFormData("priority", level.id)}
                      className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                        formData.priority === level.id
                          ? `${level.color} ring-2 ring-offset-2 ring-gray-400`
                          : `${level.color} opacity-60 hover:opacity-100`
                      }`}
                    >
                      {level.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Kunde */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Søk etter kunde
                </label>
                <Input
                  type="text"
                  placeholder="Navn eller organisasjonsnummer"
                  value={customerSearch}
                  onChange={(e) => setCustomerSearch(e.target.value)}
                  className="mt-1"
                />
              </div>

              <div className="space-y-2">
                {filteredCustomers.map((customer) => (
                  <button
                    key={customer.id}
                    type="button"
                    onClick={() => selectCustomer(customer)}
                    className={`w-full rounded-lg border-2 p-4 text-left transition-colors ${
                      formData.customerId === customer.id
                        ? "border-teal-600 bg-teal-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <Building2 className="mt-1 h-5 w-5 text-gray-400" />
                      <div>
                        <p className="font-medium">{customer.name}</p>
                        <p className="text-sm text-gray-500">
                          Org.nr: {customer.orgNumber}
                        </p>
                        <p className="text-sm text-gray-500">{customer.address}</p>
                      </div>
                      {formData.customerId === customer.id && (
                        <Check className="ml-auto h-5 w-5 text-teal-600" />
                      )}
                    </div>
                  </button>
                ))}

                {filteredCustomers.length === 0 && (
                  <div className="rounded-lg border border-dashed border-gray-300 p-8 text-center">
                    <p className="text-gray-500">Ingen kunder funnet</p>
                    <Button variant="outline" className="mt-4">
                      + Opprett ny kunde
                    </Button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Step 3: Produkt */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Produktnavn *
                  </label>
                  <Input
                    type="text"
                    placeholder="f.eks. Kjøledisk KD-500"
                    value={formData.productName}
                    onChange={(e) => updateFormData("productName", e.target.value)}
                    className="mt-1"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Serienummer
                  </label>
                  <Input
                    type="text"
                    placeholder="f.eks. SN-12345678"
                    value={formData.serialNumber}
                    onChange={(e) => updateFormData("serialNumber", e.target.value)}
                    className="mt-1"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Kjøpsdato
                </label>
                <Input
                  type="date"
                  value={formData.purchaseDate}
                  onChange={(e) => updateFormData("purchaseDate", e.target.value)}
                  className="mt-1"
                />
              </div>

              {/* Produktsøk placeholder */}
              <div className="rounded-lg border border-dashed border-gray-300 p-6">
                <div className="flex items-center gap-3">
                  <Package className="h-8 w-8 text-gray-400" />
                  <div>
                    <p className="font-medium text-gray-700">Søk i produktdatabase</p>
                    <p className="text-sm text-gray-500">
                      Finn produkt basert på modell eller serienummer
                    </p>
                  </div>
                  <Button variant="outline" className="ml-auto">
                    Søk
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Problem */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Beskrivelse av problemet *
                </label>
                <textarea
                  placeholder="Beskriv problemet så detaljert som mulig..."
                  value={formData.description}
                  onChange={(e) => updateFormData("description", e.target.value)}
                  rows={6}
                  className="mt-1 w-full rounded-md border border-gray-200 p-3 text-sm focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Minimum 10 tegn ({formData.description.length}/10)
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Vedlegg
                </label>
                <div className="rounded-lg border-2 border-dashed border-gray-300 p-8 text-center">
                  <AlertCircle className="mx-auto h-10 w-10 text-gray-400" />
                  <p className="mt-2 font-medium text-gray-700">
                    Dra og slipp filer her
                  </p>
                  <p className="text-sm text-gray-500">
                    eller klikk for å velge filer
                  </p>
                  <Button variant="outline" className="mt-4">
                    Velg filer
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Step 5: Oppsummering */}
          {currentStep === 5 && (
            <div className="space-y-6">
              <div className="rounded-lg bg-teal-50 p-4">
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-teal-600" />
                  <h3 className="font-medium text-teal-900">
                    Klar til å opprette reklamasjon
                  </h3>
                </div>
                <p className="mt-1 text-sm text-teal-700">
                  Vennligst kontroller at all informasjon er korrekt før du fortsetter.
                </p>
              </div>

              <div className="space-y-4">
                <div className="rounded-lg border p-4">
                  <h4 className="text-sm font-medium text-gray-500">Grunninfo</h4>
                  <div className="mt-2 space-y-2">
                    <p>
                      <span className="font-medium">Tittel:</span> {formData.title}
                    </p>
                    <p>
                      <span className="font-medium">Type:</span>{" "}
                      {claimTypes.find((t) => t.id === formData.claimType)?.label}
                    </p>
                    <p>
                      <span className="font-medium">Prioritet:</span>{" "}
                      {priorityLevels.find((p) => p.id === formData.priority)?.label}
                    </p>
                  </div>
                </div>

                <div className="rounded-lg border p-4">
                  <h4 className="text-sm font-medium text-gray-500">Kunde</h4>
                  <p className="mt-2 font-medium">{formData.customerName}</p>
                </div>

                <div className="rounded-lg border p-4">
                  <h4 className="text-sm font-medium text-gray-500">Produkt</h4>
                  <div className="mt-2 space-y-2">
                    <p>
                      <span className="font-medium">Navn:</span> {formData.productName}
                    </p>
                    {formData.serialNumber && (
                      <p>
                        <span className="font-medium">Serienummer:</span>{" "}
                        {formData.serialNumber}
                      </p>
                    )}
                    {formData.purchaseDate && (
                      <p>
                        <span className="font-medium">Kjøpsdato:</span>{" "}
                        {new Date(formData.purchaseDate).toLocaleDateString("nb-NO")}
                      </p>
                    )}
                  </div>
                </div>

                <div className="rounded-lg border p-4">
                  <h4 className="text-sm font-medium text-gray-500">Beskrivelse</h4>
                  <p className="mt-2 whitespace-pre-wrap text-gray-700">
                    {formData.description}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <WizardActions
            currentStep={currentStep}
            totalSteps={5}
            onPrevious={handlePrevious}
            onNext={handleNext}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
            nextDisabled={!canProceed()}
          />
        </CardContent>
      </Card>
    </div>
  );
}
