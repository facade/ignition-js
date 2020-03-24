import sourceMapResolve from 'source-map-resolve'; // https://github.com/lydell/source-map-resolve#readme

export function resolveStack(stacktrace: FlareReport['stacktrace']) {
    return new Promise(async resolve => {
        const resolvedStack: FlareReport['stacktrace'] = await Promise.all(
            stacktrace.map(async frame => {
                const code = await readFile(frame.file);

                if (!code) {
                    return frame;
                }

                sourceMapResolve.resolveSourceMap(
                    code.slice(-100),
                    frame.file,
                    readFileCallback,
                    (error: Error, result) => {
                        if (error) {
                            console.error('error:', error);
                            /* console.error(error); */
                        }

                        console.log('res:', result);
                        return 'kek';
                    },
                );
            }),
        );

        resolve(resolvedStack);
    });
}

const cachedFiles: { [key: string]: string } = {};

async function readFileCallback(url: string, callback: (result: string | null) => void) {
    const result = await readFile(url);

    callback(result);
}

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
