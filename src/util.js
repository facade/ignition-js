export function addRequiredContext(report) {
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
