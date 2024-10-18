export function mergeClasses(...classes: (string | undefined | null)[]): string {
	return classes.filter(Boolean).join(' ');
}
