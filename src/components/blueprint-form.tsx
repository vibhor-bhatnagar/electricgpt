"use client";

import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  BUILDING_TYPES,
  CANADIAN_PROVINCES,
  PROJECT_SCALES,
  VOLTAGE_CLASSES,
  type BuildingType,
  type Province,
  type ProjectScale,
  type VoltageClass,
} from "@/lib/constants";
import type { BlueprintParams } from "@/lib/blueprint-engine";
import { Zap, FileText, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface BlueprintFormProps {
  onGenerate: (params: BlueprintParams) => void;
  isLoading: boolean;
}

const CODE_BADGES = [
  { label: "CEC CSA C22.1", color: "bg-cyan-500/15 text-cyan-700 dark:text-cyan-300 border-cyan-500/30" },
  { label: "NBC 2020",       color: "bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30" },
  { label: "NFPA 72/101",   color: "bg-rose-500/15 text-rose-700 dark:text-rose-300 border-rose-500/30" },
  { label: "CSA C282",       color: "bg-violet-500/15 text-violet-700 dark:text-violet-300 border-violet-500/30" },
];

export function BlueprintForm({ onGenerate, isLoading }: BlueprintFormProps) {
  const [buildingType, setBuildingType] = useState<BuildingType | "">("");
  const [province, setProvince] = useState<Province | "">("");
  const [scale, setScale] = useState<ProjectScale | "">("");
  const [voltage, setVoltage] = useState<VoltageClass | "">("");
  const [details, setDetails] = useState("");
  const [showDetails, setShowDetails] = useState(false);

  const isValid = buildingType !== "" && province !== "";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;
    onGenerate({
      buildingType: buildingType as BuildingType,
      province: province as Province,
      scale: (scale as ProjectScale) || undefined,
      voltage: (voltage as VoltageClass) || undefined,
      details: details || undefined,
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Top row: label + badges */}
      <div className="flex items-center justify-between gap-4 mb-3">
        <div className="flex items-center gap-2 shrink-0">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary/15 border border-primary/30">
            <Zap className="h-3.5 w-3.5 text-primary" />
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground leading-none">Project Parameters</p>
            <p className="text-[10px] text-muted-foreground mt-0.5">
              Required: Facility type &amp; province
            </p>
          </div>
        </div>
        <div className="hidden sm:flex flex-wrap justify-end gap-1.5">
          {CODE_BADGES.map((b) => (
            <span
              key={b.label}
              className={cn(
                "inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium",
                b.color
              )}
            >
              {b.label}
            </span>
          ))}
        </div>
      </div>

      {/* Main controls row */}
      <div className="flex flex-wrap items-end gap-2.5">
        {/* Facility Type */}
        <div className="flex-[2] min-w-[170px] space-y-1">
          <Label className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
            Facility Type <span className="text-rose-500">*</span>
          </Label>
          <Select value={buildingType} onValueChange={(v) => setBuildingType(v as BuildingType)}>
            <SelectTrigger className="bg-input border-border text-foreground h-9 text-sm">
              <SelectValue placeholder="Select facility type…" />
            </SelectTrigger>
            <SelectContent className="bg-popover border-border">
              {BUILDING_TYPES.map((bt) => (
                <SelectItem key={bt.value} value={bt.value} className="text-sm cursor-pointer">
                  <span className="mr-2">{bt.icon}</span>
                  {bt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Province */}
        <div className="flex-[1.5] min-w-[150px] space-y-1">
          <Label className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
            Province <span className="text-rose-500">*</span>
          </Label>
          <Select value={province} onValueChange={(v) => setProvince(v as Province)}>
            <SelectTrigger className="bg-input border-border text-foreground h-9 text-sm">
              <SelectValue placeholder="Province…" />
            </SelectTrigger>
            <SelectContent className="bg-popover border-border">
              {CANADIAN_PROVINCES.map((pv) => (
                <SelectItem key={pv.value} value={pv.value} className="text-sm cursor-pointer">
                  {pv.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Scale */}
        <div className="flex-[1] min-w-[130px] space-y-1">
          <Label className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
            Scale
          </Label>
          <Select value={scale} onValueChange={(v) => setScale(v as ProjectScale)}>
            <SelectTrigger className="bg-input border-border text-foreground h-9 text-sm">
              <SelectValue placeholder="Scale…" />
            </SelectTrigger>
            <SelectContent className="bg-popover border-border">
              {PROJECT_SCALES.map((sc) => (
                <SelectItem key={sc.value} value={sc.value} className="text-sm cursor-pointer">
                  {sc.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Voltage */}
        <div className="flex-[1] min-w-[130px] space-y-1">
          <Label className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
            Voltage
          </Label>
          <Select value={voltage} onValueChange={(v) => setVoltage(v as VoltageClass)}>
            <SelectTrigger className="bg-input border-border text-foreground h-9 text-sm">
              <SelectValue placeholder="Voltage…" />
            </SelectTrigger>
            <SelectContent className="bg-popover border-border">
              {VOLTAGE_CLASSES.map((vl) => (
                <SelectItem key={vl.value} value={vl.value} className="text-sm cursor-pointer">
                  {vl.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Details toggle + Submit */}
        <div className="flex items-end gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setShowDetails(!showDetails)}
            className={cn(
              "h-9 px-3 flex items-center gap-1.5 rounded-md border border-border text-xs font-medium transition-colors",
              showDetails
                ? "bg-muted text-foreground border-border"
                : "text-muted-foreground hover:text-foreground hover:border-border/80"
            )}
          >
            <ChevronDown
              className={cn("h-3 w-3 transition-transform duration-200", showDetails && "rotate-180")}
            />
            Details
          </button>

          <button
            type="submit"
            disabled={!isValid || isLoading}
            className="h-9 px-4 rounded-md text-sm font-semibold transition-all
              bg-primary text-primary-foreground
              hover:bg-primary/90 active:scale-[0.98]
              disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100
              flex items-center gap-2 shrink-0"
          >
            {isLoading ? (
              <>
                <span className="flex gap-0.5">
                  {[0, 1, 2].map((i) => (
                    <span
                      key={i}
                      className="h-1.5 w-1.5 rounded-full bg-current pulse-dot"
                      style={{ animationDelay: `${i * 0.2}s` }}
                    />
                  ))}
                </span>
                Generating…
              </>
            ) : (
              <>
                <FileText className="h-3.5 w-3.5" />
                Generate Blueprint
              </>
            )}
          </button>
        </div>
      </div>

      {/* Expandable details */}
      {showDetails && (
        <div className="mt-2.5">
          <Textarea
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            placeholder="e.g. 8-storey hospital with Level 1 trauma centre, 450 beds, backup generator, seismic zone 3…"
            className="bg-input border-border text-foreground text-sm min-h-[64px] max-h-[120px] resize-none placeholder:text-muted-foreground/50"
          />
        </div>
      )}
    </form>
  );
}
