import { MapPin } from "lucide-react";
import { PageHeader } from "../components/ui/PageHeader";
import { TaskCard } from "../components/ui/TaskCard";
import { TextLink } from "../components/ui/TextLink";
import { Button } from "../components/ui/Button";
import { HintLine } from "../components/ui/HintLine";
import type { ClinicOption } from "../types/app";

export interface ClinicPageCopy {
  back: string;
  title: string;
  subtitle: string;
  openInMaps: string;
  privacyNote: string;
}

export interface ClinicPageProps {
  copy: ClinicPageCopy;
  options: ClinicOption[];
  onBack?: () => void;
}

/**
 * Nearby clinic finder. We never geolocate the user ourselves — each
 * row just opens a Google Maps search in a new tab, so their location
 * stays between them and Google.
 */
export function ClinicPage({ copy, options, onBack }: ClinicPageProps) {
  const openMaps = (query: string) => {
    window.open(
      `https://www.google.com/maps/search/${encodeURIComponent(query)}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  return (
    <>
      <TextLink label={copy.back} onClick={onBack} leading />

      <PageHeader title={copy.title} subtitle={copy.subtitle} />

      <div className="space-y-3">
        {options.map((option) => (
          <TaskCard
            key={option.id}
            category={option.category}
            title={option.title}
            meta={option.meta}
            action={
              <Button
                variant="secondary"
                onClick={() => openMaps(option.query)}
                className="border-2 border-brand-700 text-brand-700"
              >
                {copy.openInMaps}
              </Button>
            }
          />
        ))}
      </div>

      <HintLine
        icon={<MapPin className="h-3.5 w-3.5" />}
        message={copy.privacyNote}
      />
    </>
  );
}
