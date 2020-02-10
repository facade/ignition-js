export function addRequiredContext(report: FlareReport) {
    return {
        ...report,
        context: {
            ...report.context,
            request_data: {},
            headers: [],
            session: {},
            route: {},
            user: {},
            dumps: [],
            logs: [],
        },
    };
}

type HydrateIgnitionLoaderParams = {
    report: FlareReport;
    config: {};
};

export function hydrateIgnitionLoader(
    ignitionLoaderScript: string,
    { report, config }: HydrateIgnitionLoaderParams,
) {
    return ignitionLoaderScript
        .replace('**report**', JSON.stringify(addRequiredContext(report)))
        .replace('**config**', JSON.stringify(config));
}
