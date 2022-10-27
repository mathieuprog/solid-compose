import { addTranslations } from '@/index';

export default function addDefaultTranslations() {
  addTranslations('en', 'foo', {
    "hello": "hello",
    "foo": "bar"
  });

  addTranslations('fr', 'foo', {
    "hello": "bonjour",
  });

  addTranslations('en', 'bar', {
    "hello": "hello!",
    "world": "world!"
  });

  addTranslations('fr', 'bar', {
    "hello": "bonjour !",
    "world": "monde !"
  });

  addTranslations('fr-BE', 'bar', {
    "world": "monde !!"
  });
}
