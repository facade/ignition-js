import sourceMap from 'source-map';
import { readLinesFromFile } from '@flareapp/flare-client';
import { isUndefinedOrNull } from './util';
const wasmMappings = require('source-map/lib/mappings.wasm');

// @ts-ignore
sourceMap.SourceMapConsumer.initialize({ 'lib/mappings.wasm': wasmMappings });

const sourceMappingURLString = '//# sourceMappingURL=';

export function resolveStack(
    stacktrace: Flare.Report['stacktrace'],
): Promise<Flare.Report['stacktrace']> {
    return new Promise(resolve => {
        Promise.all(
            stacktrace.map(async frame => {
                const sourcemap = await getSourcemap(frame.file);

                if (!sourcemap) {
                    return frame;
                }

                const resolvedCode = await sourceMap.SourceMapConsumer.with(
                    sourcemap,
                    null,
                    consumer => {
                        const originalPosition = consumer.originalPositionFor({
                            line: frame.line_number,
                            column: frame.column_number,
                        });

                        if (
                            isUndefinedOrNull(originalPosition.source) ||
                            isUndefinedOrNull(originalPosition.column) ||
                            isUndefinedOrNull(originalPosition.line)
                        ) {
                            return frame;
                        }

                        const codeSnippetText = consumer.sourceContentFor(originalPosition.source!);

                        const { codeSnippet, trimmedColumnNumber } = codeSnippetText
                            ? readLinesFromFile(
                                  codeSnippetText,
                                  originalPosition.line!,
                                  originalPosition.column!,
                                  1000,
                                  50,
                              )
                            : {
                                  codeSnippet: frame.code_snippet,
                                  trimmedColumnNumber: frame.trimmed_column_number,
                              };

                        return {
                            line_number: originalPosition.line!,
                            column_number: originalPosition.column!,
                            method: originalPosition.name || frame.method,
                            file: originalPosition.source!.replace('webpack://', ''),
                            code_snippet: codeSnippet,
                            trimmed_column_number: trimmedColumnNumber,
                            class: frame.class,
                        };
                    },
                );

                return resolvedCode;
            }),
        ).then(resolve);
    });
}

async function getSourcemap(file: string): Promise<null | string> {
    const code = await readFile(file);

    if (!code) {
        return null;
    }

    const sourceMappingURLIndex = code.lastIndexOf(sourceMappingURLString);

    if (sourceMappingURLIndex === -1) {
        return null;
    }

    const sourceMappingURL = code.slice(sourceMappingURLIndex + sourceMappingURLString.length);
    const searchFrom = file.slice(0, file.lastIndexOf('/') + 1);
    const sourcemap = await readFile(searchFrom + sourceMappingURL);

    return sourcemap;
}

const cachedFiles: { [key: string]: string } = {};

function readFile(url: string): Promise<string | null> {
    return new Promise(resolve => {
        const rawFile = new XMLHttpRequest();

        if (cachedFiles[url]) {
            return resolve(cachedFiles[url]);
        }

        rawFile.open('GET', url, false);
        rawFile.onreadystatechange = () => {
            if (rawFile.readyState === 4) {
                if (rawFile.status === 200 || rawFile.status == 0) {
                    cachedFiles[url] = rawFile.responseText;

                    return resolve(rawFile.responseText);
                }
            }

            return resolve(null);
        };

        try {
            rawFile.send(null);
        } catch (error) {
            return resolve(null);
        }
    });
}
