"use client"

import type React from "react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Upload, FileText, ImageIcon, FileSpreadsheet, X } from "lucide-react"
import { useRouter } from "next/navigation"
import { useAppData } from "@/hooks/use-app-data"

export function UploadCard() {
  const router = useRouter()
  const {
    uploadedFiles,
    textInput,
    dragActive,
    isAnalyzing,
    handleDrag,
    handleDrop,
    handleFileSelect,
    removeFile,
    setTextInput,
    analyzeFiles,
    getFileIcon,
    formatFileSize,
    hasValidContent,
  } = useAppData()

  const handleAnalyze = async () => {
    const success = await analyzeFiles()
    if (success) {
      router.push("/results")
    }
  }

  return (
    <>
      <Tabs defaultValue="upload" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-muted/30 p-1 h-12">
            <TabsTrigger value="upload" className="font-light">
              Upload File
            </TabsTrigger>
            <TabsTrigger value="paste" className="font-light">
              Paste Text
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upload" className="space-y-6 mt-8">
            <div
              className={`border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300 ${
                dragActive
                  ? "border-primary bg-primary/5 scale-[1.02]"
                  : "border-border/50 hover:border-primary/30 hover:bg-muted/20"
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <Upload className="w-16 h-16 text-muted-foreground mx-auto mb-6" strokeWidth={1} />
              <div className="space-y-3">
                <p className="text-lg font-light">
                  Drop your files here, or{" "}
                  <label className="text-primary cursor-pointer hover:underline font-medium">
                    browse
                    <input
                      type="file"
                      className="hidden"
                      multiple
                      accept=".pdf,.png,.jpg,.jpeg,.csv,.txt"
                      onChange={handleFileSelect}
                    />
                  </label>
                </p>
                <p className="text-sm text-muted-foreground font-light">Supports PDF, images, CSV, and text files</p>
              </div>
            </div>

            {uploadedFiles.length > 0 && (
              <div className="space-y-3">
                <h4 className="font-medium text-sm uppercase tracking-wide text-muted-foreground">Selected Files</h4>
                {uploadedFiles.map((uploadedFile, index) => (
                  <div
                    key={uploadedFile.id}
                    className="flex items-center justify-between p-4 bg-muted/30 rounded-xl border border-border/30"
                  >
                    <div className="flex items-center gap-3">
                      {(() => {
                        const iconType = getFileIcon(uploadedFile.file)
                        if (iconType === "image") return <ImageIcon className="w-4 h-4" />
                        if (iconType === "pdf") return <FileText className="w-4 h-4" />
                        if (iconType === "spreadsheet") return <FileSpreadsheet className="w-4 h-4" />
                        return <FileText className="w-4 h-4" />
                      })()}
                      <div>
                        <span className="text-sm font-medium">{uploadedFile.file.name}</span>
                        <span className="text-xs text-muted-foreground ml-2">
                          ({formatFileSize(uploadedFile.file.size)})
                        </span>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFile(uploadedFile.id)}
                      className="hover:bg-destructive/10 hover:text-destructive"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="paste" className="space-y-6 mt-8">
            <Textarea
              placeholder="Paste your medical bill text here..."
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              className="min-h-[240px] resize-none border-border/50 bg-muted/20 focus:bg-background transition-colors"
            />
          </TabsContent>
        </Tabs>

        <div className="space-y-6 mt-8">
          <Button
            onClick={handleAnalyze}
            disabled={!hasValidContent()}
            className="w-full h-12 text-base font-medium tracking-wide"
            size="lg"
          >
            {isAnalyzing ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin"></div>
                Analyzing Bill...
              </div>
            ) : (
              "Analyze Bill"
            )}
          </Button>
        </div>

        <div className="p-6 bg-muted/20 rounded-xl border border-border/30 mt-8">
          <p className="text-xs text-muted-foreground font-light leading-relaxed">
            <span className="font-medium text-foreground">Privacy Notice:</span> Your medical information is processed
            securely and in compliance with HIPAA regulations. Files are encrypted and automatically deleted after
            analysis.
          </p>
        </div>
    </>
  )
}
