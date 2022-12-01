import { useAtomValue } from 'jotai';
import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import { GeneralForm, Query } from '../../../interfaces';
import { useSetSortedApps } from '../../../state/app';
import {
  categoriesAtom,
  useSetSortedCategories,
  useSetSortedBookmarks,
} from '../../../state/bookmark';
import {
  configAtom,
  configLoadingAtom,
  useUpdateConfig,
} from '../../../state/config';
import { customQueriesAtom } from '../../../state/queries';
import { generalSettingsTemplate, inputHandler } from '../../../utility';
import { queries } from '../../../utility/searchQueries.json';
import { Button, InputGroup, SettingsHeadline } from '../../UI';
import { CustomQueries } from './CustomQueries/CustomQueries';

export const GeneralSettings = (): JSX.Element => {
  const config = useAtomValue(configAtom);
  const loading = useAtomValue(configLoadingAtom);

  const updateConfig = useUpdateConfig();
  const customQueries = useAtomValue(customQueriesAtom);

  const setSortedApps = useSetSortedApps();

  const categories = useAtomValue(categoriesAtom);
  const setSortedCategories = useSetSortedCategories();
  const setSortedBookmarks = useSetSortedBookmarks();

  // Initial state
  const [formData, setFormData] = useState<GeneralForm>(
    generalSettingsTemplate
  );

  // Get config
  useEffect(() => {
    setFormData({
      ...config,
    });
  }, [loading]);

  // Form handler
  const formSubmitHandler = async (e: FormEvent) => {
    e.preventDefault();

    // Save settings
    await updateConfig(formData);

    // Sort entities with new settings
    if (formData.useOrdering !== config.useOrdering) {
      setSortedApps();
      setSortedCategories();

      for (let { id } of categories) {
        setSortedBookmarks(id);
      }
    }
  };

  // Input handler
  const inputChangeHandler = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    options?: { isNumber?: boolean; isBool?: boolean }
  ) => {
    inputHandler<GeneralForm>({
      e,
      options,
      setStateHandler: setFormData,
      state: formData,
    });
  };

  return (
    <>
      <form
        onSubmit={(e) => formSubmitHandler(e)}
        style={{ marginBottom: '30px' }}
      >
        {/* === GENERAL OPTIONS === */}
        <SettingsHeadline text="General" />
        {/* SORT TYPE */}
        <InputGroup>
          <label htmlFor="useOrdering">Sorting type</label>
          <select
            id="useOrdering"
            name="useOrdering"
            value={formData.useOrdering}
            onChange={(e) => inputChangeHandler(e)}
          >
            <option value="createdAt">By creation date</option>
            <option value="name">Alphabetical order</option>
            <option value="orderId">Custom order</option>
          </select>
        </InputGroup>

        {/* === APPS OPTIONS === */}
        <SettingsHeadline text="Apps" />
        {/* PIN APPS */}
        <InputGroup>
          <label htmlFor="pinAppsByDefault">
            Pin new applications by default
          </label>
          <select
            id="pinAppsByDefault"
            name="pinAppsByDefault"
            value={formData.pinAppsByDefault ? 1 : 0}
            onChange={(e) => inputChangeHandler(e, { isBool: true })}
          >
            <option value={1}>True</option>
            <option value={0}>False</option>
          </select>
        </InputGroup>

        {/* APPS OPPENING */}
        <InputGroup>
          <label htmlFor="appsSameTab">Open applications in the same tab</label>
          <select
            id="appsSameTab"
            name="appsSameTab"
            value={formData.appsSameTab ? 1 : 0}
            onChange={(e) => inputChangeHandler(e, { isBool: true })}
          >
            <option value={1}>True</option>
            <option value={0}>False</option>
          </select>
        </InputGroup>

        {/* === BOOKMARKS OPTIONS === */}
        <SettingsHeadline text="Bookmarks" />
        {/* PIN CATEGORIES */}
        <InputGroup>
          <label htmlFor="pinCategoriesByDefault">
            Pin new categories by default
          </label>
          <select
            id="pinCategoriesByDefault"
            name="pinCategoriesByDefault"
            value={formData.pinCategoriesByDefault ? 1 : 0}
            onChange={(e) => inputChangeHandler(e, { isBool: true })}
          >
            <option value={1}>True</option>
            <option value={0}>False</option>
          </select>
        </InputGroup>

        {/* BOOKMARKS OPPENING */}
        <InputGroup>
          <label htmlFor="bookmarksSameTab">
            Open bookmarks in the same tab
          </label>
          <select
            id="bookmarksSameTab"
            name="bookmarksSameTab"
            value={formData.bookmarksSameTab ? 1 : 0}
            onChange={(e) => inputChangeHandler(e, { isBool: true })}
          >
            <option value={1}>True</option>
            <option value={0}>False</option>
          </select>
        </InputGroup>

        {/* === SEARCH OPTIONS === */}
        <SettingsHeadline text="Search" />
        <InputGroup>
          <label htmlFor="defaultSearchProvider">Primary search provider</label>
          <select
            id="defaultSearchProvider"
            name="defaultSearchProvider"
            value={formData.defaultSearchProvider}
            onChange={(e) => inputChangeHandler(e)}
          >
            {[...queries, ...customQueries].map((query: Query, idx) => {
              const isCustom = idx >= queries.length;

              return (
                <option key={idx} value={query.prefix}>
                  {isCustom && '+'} {query.name}
                </option>
              );
            })}
          </select>
        </InputGroup>

        {formData.defaultSearchProvider === 'l' && (
          <InputGroup>
            <label htmlFor="secondarySearchProvider">
              Secondary search provider
            </label>
            <select
              id="secondarySearchProvider"
              name="secondarySearchProvider"
              value={formData.secondarySearchProvider}
              onChange={(e) => inputChangeHandler(e)}
            >
              {[...queries, ...customQueries].map((query: Query, idx) => {
                const isCustom = idx >= queries.length;

                return (
                  <option key={idx} value={query.prefix}>
                    {isCustom && '+'} {query.name}
                  </option>
                );
              })}
            </select>
            <span>
              Will be used when "Local search" is primary search provider and
              there are not any local results
            </span>
          </InputGroup>
        )}

        <InputGroup>
          <label htmlFor="searchSameTab">
            Open search results in the same tab
          </label>
          <select
            id="searchSameTab"
            name="searchSameTab"
            value={formData.searchSameTab ? 1 : 0}
            onChange={(e) => inputChangeHandler(e, { isBool: true })}
          >
            <option value={1}>True</option>
            <option value={0}>False</option>
          </select>
        </InputGroup>

        <Button>Save changes</Button>
      </form>

      {/* CUSTOM QUERIES */}
      <SettingsHeadline text="Custom search providers" />
      <CustomQueries />
    </>
  );
};
