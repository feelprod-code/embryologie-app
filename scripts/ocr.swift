import Vision
import Foundation
import AppKit

let semaphore = DispatchSemaphore(value: 0)

func recognizeText(in imagePath: String) {
    guard let image = NSImage(contentsOfFile: imagePath),
          let cgImage = image.cgImage(forProposedRect: nil, context: nil, hints: nil) else {
        print("Could not load image at \(imagePath)")
        semaphore.signal()
        return
    }

    let request = VNRecognizeTextRequest { request, error in
        guard let observations = request.results as? [VNRecognizedTextObservation], error == nil else {
            print("OCR Error: \(error?.localizedDescription ?? "Unknown error")")
            semaphore.signal()
            return
        }

        let recognizedText = observations.compactMap { observation in
            observation.topCandidates(1).first?.string
        }.joined(separator: "\n")

        print("\n--- \(URL(fileURLWithPath: imagePath).lastPathComponent) ---")
        print(recognizedText)
        semaphore.signal()
    }

    request.recognitionLevel = .accurate
    // request.usesLanguageCorrection = true // default is true

    let handler = VNImageRequestHandler(cgImage: cgImage, options: [:])
    do {
        try handler.perform([request])
    } catch {
        print("Failed to perform OCR: \(error)")
        semaphore.signal()
    }
}

let args = CommandLine.arguments
if args.count < 2 {
    print("Usage: swift ocr.swift <directory_path>")
    exit(1)
}

let directoryPath = args[1]
let fileManager = FileManager.default

do {
    let files = try fileManager.contentsOfDirectory(atPath: directoryPath)
    // sort files alphabetically to maintain order
    let imageFiles = files.filter { $0.lowercased().hasSuffix(".png") || $0.lowercased().hasSuffix(".jpg") || $0.lowercased().hasSuffix(".jpeg") }.sorted()
    
    for file in imageFiles {
        let fullPath = (directoryPath as NSString).appendingPathComponent(file)
        recognizeText(in: fullPath)
        semaphore.wait()
    }
} catch {
    print("Error reading directory: \(error)")
}
