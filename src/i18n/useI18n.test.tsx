import { afterEach, beforeEach, describe, expect, test } from 'vitest';
import { cleanup, fireEvent, render, screen } from 'solid-testing-library';
import use18n, { addTranslations, I18nProvider } from './useI18n';

describe("useI18n", () => {
  beforeEach(() => {
    addTranslations("en", "foo", {
      "hello": "hello",
      "foo": "bar"
    });

    addTranslations("fr", "foo", {
      "hello": "bonjour",
    });

    addTranslations("en", "bar", {
      "hello": "hello!",
      "world": "world!"
    });

    addTranslations("fr", "bar", {
      "hello": "bonjour!",
      "world": "monde!"
    });
  });

  afterEach(cleanup);

  test("translate", async () => {
    function Hello() {
      const [translate, locale] = use18n();
      return <>
        <div data-testid="hello">{translate('hello')}</div>
        <div data-testid="world">{translate('world')}</div>
        <div data-testid="foo">{translate('foo')}</div>
        <button data-testid="locale" onClick={() => locale("fr")}>
          {locale()}
        </button>
      </>;
    }

    render(() =>
      <I18nProvider locale="en" namespaces={["foo", "bar"]}>
        <Hello/>
      </I18nProvider>
    );

    const hello = screen.getByTestId("hello");
    const world = screen.getByTestId("world");
    const foo = screen.getByTestId("foo");
    const locale = screen.getByTestId("locale");

    expect(hello).toHaveTextContent("hello!");
    expect(world).toHaveTextContent("world!");
    expect(foo).toHaveTextContent("bar");
    expect(locale).toHaveTextContent("en");

    fireEvent.click(locale);
    // the event loop takes one Promise to resolve to be finished
    await Promise.resolve();

    expect(hello).toHaveTextContent("bonjour!");
    expect(world).toHaveTextContent("monde!");
    expect(foo).toHaveTextContent("bar");
    expect(locale).toHaveTextContent("fr");
  });
});
