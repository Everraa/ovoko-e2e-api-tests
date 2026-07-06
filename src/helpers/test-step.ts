import { test } from '@playwright/test';

function humanizeMethodName(methodName: string): string {
  const spaced = methodName
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/_/g, ' ')
    .trim();

  return spaced.charAt(0).toUpperCase() + spaced.slice(1);
}

function formatStepArgs(args: unknown[]): string | undefined {
  const printable = args.filter(
    (arg) => typeof arg === 'string' || typeof arg === 'number' || typeof arg === 'boolean',
  );

  if (printable.length === 0) {
    return undefined;
  }

  return printable.map(String).join(', ');
}

function buildStepTitle(className: string, methodName: string, args: unknown[]): string {
  const pageName = className.endsWith('Page') ? className.slice(0, -4) : className;
  const action = humanizeMethodName(methodName);
  const argSummary = formatStepArgs(args);

  return argSummary ? `${pageName} › ${action} (${argSummary})` : `${pageName} › ${action}`;
}

export function TestStep<This, Args extends unknown[], Return>(
  originalMethod: (this: This, ...args: Args) => Promise<Return>,
  context: ClassMethodDecoratorContext<This, (this: This, ...args: Args) => Promise<Return>>,
) {
  const methodName = String(context.name);

  return async function (this: This, ...args: Args): Promise<Return> {
    const className =
      (this as { constructor?: { name?: string } }).constructor?.name ?? 'PageObject';
    const title = buildStepTitle(className, methodName, args);

    return test.step(title, async () => originalMethod.apply(this, args), { box: true });
  };
}
