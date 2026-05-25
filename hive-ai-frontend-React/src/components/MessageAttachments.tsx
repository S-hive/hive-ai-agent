import { Download, FileText, ImageIcon } from 'lucide-react'
import { getAttachmentDownloadUrl } from '@/api/ai'
import type { ChatAttachment } from '@/types/attachment'

interface MessageAttachmentsProps {
  attachments: ChatAttachment[]
}

function formatFileSize(size?: number) {
  if (!size || size <= 0) return ''
  if (size < 1024) return `${size} B`
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`
  return `${(size / (1024 * 1024)).toFixed(1)} MB`
}

function AttachmentIcon({ mimeType }: { mimeType: string }) {
  if (mimeType.startsWith('image/')) {
    return <ImageIcon className="h-4 w-4 shrink-0 text-[#615ced]" />
  }
  if (mimeType === 'application/pdf') {
    return <FileText className="h-4 w-4 shrink-0 text-[#615ced]" />
  }
  return <Download className="h-4 w-4 shrink-0 text-[#615ced]" />
}

export function MessageAttachments({ attachments }: MessageAttachmentsProps) {
  if (!attachments.length) return null

  return (
    <div className="mt-3 flex flex-col gap-2 border-t border-[#eef0f3] pt-3">
      <p className="text-xs font-medium text-[#86909c]">附件</p>
      <div className="flex flex-col gap-2">
        {attachments.map((attachment) => {
          const downloadUrl = attachment.url.startsWith('http')
            ? attachment.url
            : getAttachmentDownloadUrl(attachment.id)
          const previewUrl = attachment.mimeType.startsWith('image/')
            ? `${downloadUrl}?inline=true`
            : downloadUrl

          return (
            <div
              key={attachment.id}
              className="flex items-center gap-3 rounded-xl border border-[#e5e6eb] bg-[#fafafa] px-3 py-2.5"
            >
              {attachment.mimeType.startsWith('image/') ? (
                <a
                  href={previewUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="shrink-0 overflow-hidden rounded-lg border border-[#e5e6eb] bg-white"
                >
                  <img
                    src={previewUrl}
                    alt={attachment.fileName}
                    className="h-12 w-12 object-cover"
                  />
                </a>
              ) : (
                <AttachmentIcon mimeType={attachment.mimeType} />
              )}

              <div className="min-w-0 flex-1">
                <a
                  href={downloadUrl}
                  download={attachment.fileName}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block truncate text-sm font-medium text-[#1f2329] hover:text-[#615ced]"
                >
                  {attachment.fileName}
                </a>
                {attachment.size ? (
                  <p className="mt-0.5 text-xs text-[#86909c]">{formatFileSize(attachment.size)}</p>
                ) : null}
              </div>

              <a
                href={downloadUrl}
                download={attachment.fileName}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex shrink-0 items-center gap-1 rounded-lg bg-[#f3f2ff] px-2.5 py-1.5 text-xs font-medium text-[#615ced] hover:bg-[#ebe9ff]"
              >
                <Download className="h-3.5 w-3.5" />
                下载
              </a>
            </div>
          )
        })}
      </div>
    </div>
  )
}
