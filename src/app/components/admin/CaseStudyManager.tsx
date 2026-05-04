import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Label } from "../ui/label";
import { Plus, X, Save } from "lucide-react";
import type { CaseStudy } from "../../App";

interface CaseStudyManagerProps {
  caseStudy?: CaseStudy;
  onChange: (caseStudy: CaseStudy | undefined) => void;
}

export function CaseStudyManager({ caseStudy, onChange }: CaseStudyManagerProps) {
  const [isEnabled, setIsEnabled] = useState(!!caseStudy);
  const [showPreview, setShowPreview] = useState(false);

  // Sync local state with prop changes
  useEffect(() => {
    setIsEnabled(!!caseStudy);
  }, [caseStudy]);

  const handleToggle = () => {
    const newEnabled = !isEnabled;
    setIsEnabled(newEnabled);
    if (!newEnabled) {
      onChange(undefined);
    } else {
      onChange({
        oneLineSummary: "",
        client: "",
        timeframe: "",
        context: "",
        challenge: "",
        objectives: [],
        strategyTitle: "",
        strategyDescription: "",
        whatWeDid: [],
        deliverables: "",
        role: "",
        responsibilities: "",
        resultsIntro: "",
        resultsMetrics: [],
        resultsDetails: [],
        whatMadeItWork: [],
        learnings: [],
        whatToShow: [],
        source: "",
      });
    }
  };

  const updateField = <K extends keyof CaseStudy>(field: K, value: CaseStudy[K]) => {
    if (!caseStudy) return;
    onChange({
      ...caseStudy,
      [field]: value,
    } as CaseStudy);
  };

  const addObjective = () => {
    updateField("objectives", [...(caseStudy?.objectives || []), ""]);
  };

  const updateObjective = (index: number, value: string) => {
    const newObjectives = [...(caseStudy?.objectives || [])];
    newObjectives[index] = value;
    updateField("objectives", newObjectives);
  };

  const removeObjective = (index: number) => {
    const newObjectives = caseStudy?.objectives?.filter((_, i) => i !== index) || [];
    updateField("objectives", newObjectives);
  };

  const addWhatWeDid = () => {
    updateField("whatWeDid", [...(caseStudy?.whatWeDid || []), { category: "", items: [] }]);
  };

  const updateWhatWeDidCategory = (index: number, category: string) => {
    const newWhatWeDid = [...(caseStudy?.whatWeDid || [])];
    newWhatWeDid[index] = { ...newWhatWeDid[index], category };
    updateField("whatWeDid", newWhatWeDid);
  };

  const addWhatWeDidItem = (sectionIndex: number) => {
    const newWhatWeDid = [...(caseStudy?.whatWeDid || [])];
    newWhatWeDid[sectionIndex] = {
      ...newWhatWeDid[sectionIndex],
      items: [...newWhatWeDid[sectionIndex].items, ""],
    };
    updateField("whatWeDid", newWhatWeDid);
  };

  const updateWhatWeDidItem = (sectionIndex: number, itemIndex: number, value: string) => {
    const newWhatWeDid = [...(caseStudy?.whatWeDid || [])];
    newWhatWeDid[sectionIndex].items[itemIndex] = value;
    updateField("whatWeDid", newWhatWeDid);
  };

  const removeWhatWeDidItem = (sectionIndex: number, itemIndex: number) => {
    const newWhatWeDid = [...(caseStudy?.whatWeDid || [])];
    newWhatWeDid[sectionIndex].items = newWhatWeDid[sectionIndex].items.filter((_, i) => i !== itemIndex);
    updateField("whatWeDid", newWhatWeDid);
  };

  const removeWhatWeDid = (index: number) => {
    const newWhatWeDid = caseStudy?.whatWeDid?.filter((_, i) => i !== index) || [];
    updateField("whatWeDid", newWhatWeDid);
  };

  const addResultMetric = () => {
    updateField("resultsMetrics", [...(caseStudy?.resultsMetrics || []), ""]);
  };

  const updateResultMetric = (index: number, value: string) => {
    const newMetrics = [...(caseStudy?.resultsMetrics || [])];
    newMetrics[index] = value;
    updateField("resultsMetrics", newMetrics);
  };

  const removeResultMetric = (index: number) => {
    const newMetrics = caseStudy?.resultsMetrics?.filter((_, i) => i !== index) || [];
    updateField("resultsMetrics", newMetrics);
  };

  const addResultDetail = () => {
    updateField("resultsDetails", [...(caseStudy?.resultsDetails || []), { category: "", items: [] }]);
  };

  const updateResultDetailCategory = (index: number, category: string) => {
    const newDetails = [...(caseStudy?.resultsDetails || [])];
    newDetails[index] = { ...newDetails[index], category };
    updateField("resultsDetails", newDetails);
  };

  const addResultDetailItem = (sectionIndex: number) => {
    const newDetails = [...(caseStudy?.resultsDetails || [])];
    newDetails[sectionIndex] = {
      ...newDetails[sectionIndex],
      items: [...newDetails[sectionIndex].items, ""],
    };
    updateField("resultsDetails", newDetails);
  };

  const updateResultDetailItem = (sectionIndex: number, itemIndex: number, value: string) => {
    const newDetails = [...(caseStudy?.resultsDetails || [])];
    newDetails[sectionIndex].items[itemIndex] = value;
    updateField("resultsDetails", newDetails);
  };

  const removeResultDetailItem = (sectionIndex: number, itemIndex: number) => {
    const newDetails = [...(caseStudy?.resultsDetails || [])];
    newDetails[sectionIndex].items = newDetails[sectionIndex].items.filter((_, i) => i !== itemIndex);
    updateField("resultsDetails", newDetails);
  };

  const removeResultDetail = (index: number) => {
    const newDetails = caseStudy?.resultsDetails?.filter((_, i) => i !== index) || [];
    updateField("resultsDetails", newDetails);
  };

  // Helper for simple array fields
  const addArrayItem = (field: "whatMadeItWork" | "learnings" | "whatToShow") => {
    updateField(field, [...(caseStudy?.[field] || []), ""]);
  };

  const updateArrayItem = (field: "whatMadeItWork" | "learnings" | "whatToShow", index: number, value: string) => {
    const newArray = [...(caseStudy?.[field] || [])];
    newArray[index] = value;
    updateField(field, newArray);
  };

  const removeArrayItem = (field: "whatMadeItWork" | "learnings" | "whatToShow", index: number) => {
    const newArray = caseStudy?.[field]?.filter((_, i) => i !== index) || [];
    updateField(field, newArray);
  };

  if (!isEnabled) {
    return (
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium">Case Study</h3>
          <Button onClick={handleToggle} variant="outline" size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Add Case Study
          </Button>
        </div>
        <p className="text-sm text-gray-600">
          Add a comprehensive case study with objectives, strategy, results, and learnings.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200 space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Case Study</h3>
        <div className="flex gap-2">
          <Button 
            onClick={() => setShowPreview(!showPreview)} 
            variant="outline" 
            size="sm"
          >
            {showPreview ? "Hide Preview" : "Show Preview"}
          </Button>
          <Button onClick={handleToggle} variant="destructive" size="sm">
            <X className="w-4 h-4 mr-2" />
            Remove Case Study
          </Button>
        </div>
      </div>

      {/* Live Preview */}
      {showPreview && caseStudy && (
        <div className="border-2 border-blue-500 rounded-lg p-8 bg-gray-50 space-y-12 max-h-[600px] overflow-y-auto">
          <div className="bg-white px-4 py-2 sticky top-0 border-b border-gray-200 -mx-8 -mt-8 mb-4">
            <p className="text-sm font-medium text-blue-600">📱 Live Preview - How it will look on your site</p>
          </div>

          {/* One Line Summary */}
          {caseStudy.oneLineSummary && (
            <div className="space-y-3">
              <h3 className="text-sm tracking-wider text-gray-500">One line summary</h3>
              <p className="text-xl leading-relaxed">{caseStudy.oneLineSummary}</p>
            </div>
          )}

          {/* Client & Timeframe */}
          {(caseStudy.client || caseStudy.timeframe) && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              {caseStudy.client && (
                <div className="space-y-3">
                  <h3 className="text-sm tracking-wider text-gray-500">Client</h3>
                  <p className="text-base leading-relaxed">{caseStudy.client}</p>
                </div>
              )}
              {caseStudy.timeframe && (
                <div className="space-y-3">
                  <h3 className="text-sm tracking-wider text-gray-500">Timeframe</h3>
                  <p className="text-base leading-relaxed">{caseStudy.timeframe}</p>
                </div>
              )}
            </div>
          )}

          {/* Context */}
          {caseStudy.context && (
            <div className="space-y-3">
              <h3 className="text-sm tracking-wider text-gray-500">Context</h3>
              <p className="text-base leading-relaxed whitespace-pre-line">{caseStudy.context}</p>
            </div>
          )}

          {/* Challenge */}
          {caseStudy.challenge && (
            <div className="space-y-3">
              <h3 className="text-sm tracking-wider text-gray-500">Challenge</h3>
              <p className="text-base leading-relaxed whitespace-pre-line">{caseStudy.challenge}</p>
            </div>
          )}

          {/* Objectives */}
          {caseStudy.objectives && caseStudy.objectives.length > 0 && caseStudy.objectives.some(o => o) && (
            <div className="space-y-3">
              <h3 className="text-sm tracking-wider text-gray-500">Objectives</h3>
              <ol className="space-y-2 list-none">
                {caseStudy.objectives.filter(o => o).map((objective, index) => (
                  <li key={index} className="text-base leading-relaxed flex gap-3">
                    <span className="text-gray-400 font-mono">{index + 1}.</span>
                    <span>{objective}</span>
                  </li>
                ))}
              </ol>
            </div>
          )}

          {/* Strategy */}
          {(caseStudy.strategyTitle || caseStudy.strategyDescription) && (
            <div className="space-y-3">
              <h3 className="text-sm tracking-wider text-gray-500">Strategy</h3>
              {caseStudy.strategyTitle && (
                <h4 className="text-lg font-medium">{caseStudy.strategyTitle}</h4>
              )}
              {caseStudy.strategyDescription && (
                <p className="text-base leading-relaxed whitespace-pre-line">{caseStudy.strategyDescription}</p>
              )}
            </div>
          )}

          {/* What We Did */}
          {caseStudy.whatWeDid && caseStudy.whatWeDid.length > 0 && caseStudy.whatWeDid.some(w => w.category || w.items.length > 0) && (
            <div className="space-y-6">
              <h3 className="text-sm tracking-wider text-gray-500">What we did</h3>
              {caseStudy.whatWeDid.filter(w => w.category || w.items.length > 0).map((section, sectionIndex) => (
                <div key={sectionIndex} className="space-y-3">
                  {section.category && <h4 className="text-base font-medium">{section.category}</h4>}
                  {section.items.length > 0 && (
                    <ul className="space-y-2 list-none">
                      {section.items.filter(i => i).map((item, itemIndex) => (
                        <li key={itemIndex} className="text-base leading-relaxed flex gap-3">
                          <span className="text-gray-400 font-mono">{itemIndex + 1}.</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Deliverables */}
          {caseStudy.deliverables && (
            <div className="space-y-3">
              <h3 className="text-sm tracking-wider text-gray-500">Deliverables</h3>
              <p className="text-base leading-relaxed">{caseStudy.deliverables}</p>
            </div>
          )}

          {/* Your Role */}
          {(caseStudy.role || caseStudy.responsibilities) && (
            <div className="space-y-3">
              <h3 className="text-sm tracking-wider text-gray-500">Your role</h3>
              {caseStudy.role && (
                <p className="text-base"><span className="font-medium">Role:</span> {caseStudy.role}</p>
              )}
              {caseStudy.responsibilities && (
                <p className="text-base"><span className="font-medium">Responsibilities:</span> {caseStudy.responsibilities}</p>
              )}
            </div>
          )}

          {/* Results */}
          {(caseStudy.resultsIntro || (caseStudy.resultsMetrics && caseStudy.resultsMetrics.length > 0) || (caseStudy.resultsDetails && caseStudy.resultsDetails.length > 0)) && (
            <div className="space-y-6 bg-white border border-gray-200 -mx-4 sm:-mx-6 px-4 sm:px-6 py-8 sm:py-12">
              <h3 className="text-sm tracking-wider text-gray-500">Results — externally validated impact</h3>
              
              {caseStudy.resultsIntro && (
                <p className="text-base leading-relaxed whitespace-pre-line">{caseStudy.resultsIntro}</p>
              )}

              {caseStudy.resultsMetrics && caseStudy.resultsMetrics.length > 0 && caseStudy.resultsMetrics.some(m => m) && (
                <ul className="space-y-2 list-none">
                  {caseStudy.resultsMetrics.filter(m => m).map((metric, index) => (
                    <li key={index} className="text-base leading-relaxed">• {metric}</li>
                  ))}
                </ul>
              )}

              {caseStudy.resultsDetails && caseStudy.resultsDetails.length > 0 && caseStudy.resultsDetails.some(d => d.category || d.items.length > 0) && (
                <div className="space-y-6">
                  {caseStudy.resultsDetails.filter(d => d.category || d.items.length > 0).map((detail, detailIndex) => (
                    <div key={detailIndex} className="space-y-3">
                      {detail.category && <h4 className="text-base font-medium">{detail.category}</h4>}
                      {detail.items.length > 0 && (
                        <ul className="space-y-2 list-none">
                          {detail.items.filter(i => i).map((item, itemIndex) => (
                            <li key={itemIndex} className="text-base leading-relaxed">• {item}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* What Made It Work */}
          {caseStudy.whatMadeItWork && caseStudy.whatMadeItWork.length > 0 && caseStudy.whatMadeItWork.some(w => w) && (
            <div className="space-y-3">
              <h3 className="text-sm tracking-wider text-gray-500">What made it work</h3>
              <ol className="space-y-2 list-none">
                {caseStudy.whatMadeItWork.filter(w => w).map((item, index) => (
                  <li key={index} className="text-base leading-relaxed flex gap-3">
                    <span className="text-gray-400 font-mono">{index + 1}.</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ol>
            </div>
          )}

          {/* Learnings */}
          {caseStudy.learnings && caseStudy.learnings.length > 0 && caseStudy.learnings.some(l => l) && (
            <div className="space-y-3">
              <h3 className="text-sm tracking-wider text-gray-500">Learnings</h3>
              <ol className="space-y-2 list-none">
                {caseStudy.learnings.filter(l => l).map((learning, index) => (
                  <li key={index} className="text-base leading-relaxed flex gap-3">
                    <span className="text-gray-400 font-mono">{index + 1}.</span>
                    <span>{learning}</span>
                  </li>
                ))}
              </ol>
            </div>
          )}

          {/* What to Show */}
          {caseStudy.whatToShow && caseStudy.whatToShow.length > 0 && caseStudy.whatToShow.some(w => w) && (
            <div className="space-y-3">
              <h3 className="text-sm tracking-wider text-gray-500">What I would show on the page</h3>
              <ol className="space-y-2 list-none">
                {caseStudy.whatToShow.filter(w => w).map((item, index) => (
                  <li key={index} className="text-base leading-relaxed flex gap-3">
                    <span className="text-gray-400 font-mono">{index + 1}.</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ol>
            </div>
          )}

          {/* Source */}
          {caseStudy.source && (
            <div className="pt-8 border-t border-gray-200">
              <p className="text-sm text-gray-500 italic">{caseStudy.source}</p>
            </div>
          )}
        </div>
      )}

      {/* One Line Summary */}
      <div className="space-y-2">
        <Label>One Line Summary</Label>
        <Textarea
          value={caseStudy?.oneLineSummary || ""}
          onChange={(e) => updateField("oneLineSummary", e.target.value)}
          placeholder="Brief summary of the project impact and contribution"
          rows={2}
        />
      </div>

      {/* Client & Timeframe */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Client</Label>
          <Input
            value={caseStudy?.client || ""}
            onChange={(e) => updateField("client", e.target.value)}
            placeholder="Client name(s)"
          />
        </div>
        <div className="space-y-2">
          <Label>Timeframe</Label>
          <Input
            value={caseStudy?.timeframe || ""}
            onChange={(e) => updateField("timeframe", e.target.value)}
            placeholder="e.g., 2020 to early 2021"
          />
        </div>
      </div>

      {/* Context */}
      <div className="space-y-2">
        <Label>Context</Label>
        <Textarea
          value={caseStudy?.context || ""}
          onChange={(e) => updateField("context", e.target.value)}
          placeholder="Background and context of the project"
          rows={3}
        />
      </div>

      {/* Challenge */}
      <div className="space-y-2">
        <Label>Challenge</Label>
        <Textarea
          value={caseStudy?.challenge || ""}
          onChange={(e) => updateField("challenge", e.target.value)}
          placeholder="Key challenges to address"
          rows={3}
        />
      </div>

      {/* Objectives */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label>Objectives</Label>
          <Button onClick={addObjective} variant="outline" size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Add Objective
          </Button>
        </div>
        {caseStudy?.objectives?.map((objective, index) => (
          <div key={index} className="flex gap-2">
            <span className="text-sm text-gray-500 pt-2">{index + 1}.</span>
            <Input
              value={objective}
              onChange={(e) => updateObjective(index, e.target.value)}
              placeholder="Objective description"
            />
            <Button
              onClick={() => removeObjective(index)}
              variant="ghost"
              size="sm"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        ))}
      </div>

      {/* Strategy */}
      <div className="space-y-3">
        <Label>Strategy</Label>
        <Input
          value={caseStudy?.strategyTitle || ""}
          onChange={(e) => updateField("strategyTitle", e.target.value)}
          placeholder="Strategy title (e.g., 'Global plus Local execution')"
        />
        <Textarea
          value={caseStudy?.strategyDescription || ""}
          onChange={(e) => updateField("strategyDescription", e.target.value)}
          placeholder="Strategy description"
          rows={3}
        />
      </div>

      {/* What We Did */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label>What We Did</Label>
          <Button onClick={addWhatWeDid} variant="outline" size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Add Section
          </Button>
        </div>
        {caseStudy?.whatWeDid?.map((section, sectionIndex) => (
          <div key={sectionIndex} className="border border-gray-200 rounded p-4 space-y-3">
            <div className="flex gap-2">
              <Input
                value={section.category}
                onChange={(e) => updateWhatWeDidCategory(sectionIndex, e.target.value)}
                placeholder="Category (e.g., 'Campaign workstreams')"
              />
              <Button
                onClick={() => removeWhatWeDid(sectionIndex)}
                variant="ghost"
                size="sm"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            <div className="space-y-2 pl-4">
              <Button
                onClick={() => addWhatWeDidItem(sectionIndex)}
                variant="outline"
                size="sm"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Item
              </Button>
              {section.items.map((item, itemIndex) => (
                <div key={itemIndex} className="flex gap-2">
                  <span className="text-sm text-gray-500 pt-2">{itemIndex + 1}.</span>
                  <Input
                    value={item}
                    onChange={(e) => updateWhatWeDidItem(sectionIndex, itemIndex, e.target.value)}
                    placeholder="Item description"
                  />
                  <Button
                    onClick={() => removeWhatWeDidItem(sectionIndex, itemIndex)}
                    variant="ghost"
                    size="sm"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Deliverables */}
      <div className="space-y-2">
        <Label>Deliverables</Label>
        <Input
          value={caseStudy?.deliverables || ""}
          onChange={(e) => updateField("deliverables", e.target.value)}
          placeholder="Key visuals, campaign landing pages, social assets, etc."
        />
      </div>

      {/* Your Role */}
      <div className="space-y-3">
        <Label>Your Role</Label>
        <Input
          value={caseStudy?.role || ""}
          onChange={(e) => updateField("role", e.target.value)}
          placeholder="e.g., Art Director and Brand, UX Lead"
        />
        <Textarea
          value={caseStudy?.responsibilities || ""}
          onChange={(e) => updateField("responsibilities", e.target.value)}
          placeholder="Responsibilities (comma-separated or brief description)"
          rows={2}
        />
      </div>

      {/* Results */}
      <div className="space-y-4 border-t pt-6">
        <h4 className="font-medium">Results</h4>
        
        <div className="space-y-2">
          <Label>Results Introduction</Label>
          <Textarea
            value={caseStudy?.resultsIntro || ""}
            onChange={(e) => updateField("resultsIntro", e.target.value)}
            placeholder="Introduction to results section"
            rows={2}
          />
        </div>

        {/* Results Metrics */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label>Key Metrics (Top-level)</Label>
            <Button onClick={addResultMetric} variant="outline" size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Add Metric
            </Button>
          </div>
          {caseStudy?.resultsMetrics?.map((metric, index) => (
            <div key={index} className="flex gap-2">
              <Input
                value={metric}
                onChange={(e) => updateResultMetric(index, e.target.value)}
                placeholder="e.g., 33% growth in monthly active users"
              />
              <Button
                onClick={() => removeResultMetric(index)}
                variant="ghost"
                size="sm"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>

        {/* Results Details */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label>Detailed Results (Categorized)</Label>
            <Button onClick={addResultDetail} variant="outline" size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Add Category
            </Button>
          </div>
          {caseStudy?.resultsDetails?.map((detail, detailIndex) => (
            <div key={detailIndex} className="border border-gray-200 rounded p-4 space-y-3">
              <div className="flex gap-2">
                <Input
                  value={detail.category}
                  onChange={(e) => updateResultDetailCategory(detailIndex, e.target.value)}
                  placeholder="Category (e.g., 'Growth in usage and distribution')"
                />
                <Button
                  onClick={() => removeResultDetail(detailIndex)}
                  variant="ghost"
                  size="sm"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              <div className="space-y-2 pl-4">
                <Button
                  onClick={() => addResultDetailItem(detailIndex)}
                  variant="outline"
                  size="sm"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Metric
                </Button>
                {detail.items.map((item, itemIndex) => (
                  <div key={itemIndex} className="flex gap-2">
                    <Input
                      value={item}
                      onChange={(e) => updateResultDetailItem(detailIndex, itemIndex, e.target.value)}
                      placeholder="Metric description"
                    />
                    <Button
                      onClick={() => removeResultDetailItem(detailIndex, itemIndex)}
                      variant="ghost"
                      size="sm"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* What Made It Work */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label>What Made It Work</Label>
          <Button onClick={() => addArrayItem("whatMadeItWork")} variant="outline" size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Add Item
          </Button>
        </div>
        {caseStudy?.whatMadeItWork?.map((item, index) => (
          <div key={index} className="flex gap-2">
            <span className="text-sm text-gray-500 pt-2">{index + 1}.</span>
            <Input
              value={item}
              onChange={(e) => updateArrayItem("whatMadeItWork", index, e.target.value)}
              placeholder="Success factor"
            />
            <Button
              onClick={() => removeArrayItem("whatMadeItWork", index)}
              variant="ghost"
              size="sm"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        ))}
      </div>

      {/* Learnings */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label>Learnings</Label>
          <Button onClick={() => addArrayItem("learnings")} variant="outline" size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Add Learning
          </Button>
        </div>
        {caseStudy?.learnings?.map((item, index) => (
          <div key={index} className="flex gap-2">
            <span className="text-sm text-gray-500 pt-2">{index + 1}.</span>
            <Input
              value={item}
              onChange={(e) => updateArrayItem("learnings", index, e.target.value)}
              placeholder="Key learning"
            />
            <Button
              onClick={() => removeArrayItem("learnings", index)}
              variant="ghost"
              size="sm"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        ))}
      </div>

      {/* What to Show */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label>What to Show on the Page</Label>
          <Button onClick={() => addArrayItem("whatToShow")} variant="outline" size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Add Item
          </Button>
        </div>
        {caseStudy?.whatToShow?.map((item, index) => (
          <div key={index} className="flex gap-2">
            <span className="text-sm text-gray-500 pt-2">{index + 1}.</span>
            <Input
              value={item}
              onChange={(e) => updateArrayItem("whatToShow", index, e.target.value)}
              placeholder="What to display visually"
            />
            <Button
              onClick={() => removeArrayItem("whatToShow", index)}
              variant="ghost"
              size="sm"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        ))}
      </div>

      {/* Source */}
      <div className="space-y-2">
        <Label>Source / Citation</Label>
        <Input
          value={caseStudy?.source || ""}
          onChange={(e) => updateField("source", e.target.value)}
          placeholder="External reporting source, publication, date, etc."
        />
      </div>
    </div>
  );
}