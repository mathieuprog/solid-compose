import { addTranslations } from '@/index';

export default function addDefaultTranslations() {
  // TODO: on collision option?
  addTranslations('en', {
    "hello": "hello",
    "foo": "bar"
  });

  addTranslations('fr', {
    "hello": "bonjour"
  });

  addTranslations('en', {
    "hello": "hello!",
    "world": "world!"
  });

  addTranslations('fr', {
    "hello": "bonjour !",
    "world": "monde !"
  });

  addTranslations('fr-BE', {
    "world": "monde !!"
  });
}
