import { parseModelName } from '../../../../utils/text';
import { getFeaturePrefix, getFieldList } from '../../../../utils/tools';
import { FormMeta } from '../../../../utils/types';

export const generateLoadListController = (
  curDir: string,
  meta: FormMeta
): string => {
  const featurePrefix = getFeaturePrefix(curDir, meta.ui.baseFolderPath);
  const name = parseModelName(meta.model);
  const tableFields = [
    ...getFieldList(meta)
      .filter((i) => i.type !== 'File')
      .map((i) => i.fieldName),
    'updated_at',
    'created_at',
  ];
  const visibleFields = [
    ...getFieldList(meta)
      .filter((i) => !i.hideOnTable)
      .map((i) => i.fieldName),
    'updated_at',
    'created_at',
  ];

  return `
import { useEffect } from 'react';
import { shallow } from 'zustand/shallow';
import { useToken } from '${featurePrefix}auth/lib/hooks/useToken';
import use${meta.plural.capital}State from '../states/use${
    meta.plural.capital
  }State';

export const useLoad${meta.plural.capital} = () => {
  const tableFields = ${JSON.stringify(tableFields)};
  const viewColumns = ${JSON.stringify(visibleFields)};
  const token = useToken();
  const [
    ${meta.plural.model},
    loading,
    fetch${meta.plural.capital},
    tableMeta,
    total,
    curPage,
    setCurPage,
    onSetRowsPerPage,
    edit${name.modelName},
    setEdit${name.modelName},
    formLoading,
    setSort,
    filters,
    setFilters,
    selectedItems,
    toggleAllSelection,
    remove${meta.plural.capital},
    setDeletingMulti,
    toggleFieldVisibility,
    visibleColumns,
  ] = use${meta.plural.capital}State(
    (state) => [
      state.${meta.plural.model},
      state.loading,
      state.fetch${meta.plural.capital},
      state.tableMeta,
      state.total,
      state.curPage,
      state.setCurPage,
      state.onSetRowsPerPage,
      state.editable${name.modelName},
      state.setEditable${name.modelName},
      state.formLoading,
      state.setSort,
      state.filters,
      state.setFilters,
      state.selectedItems,
      state.toggleAllSelection,
      state.remove${meta.plural.capital},
      state.setDeletingMulti,
      state.toggleFieldVisibility,
      state.visibleColumns,
    ],
    shallow
  );

  const handleFetch = () => fetch${meta.plural.capital}({ token });

  useEffect(() => {
    handleFetch();
  }, [tableMeta, curPage, filters]);

  const onNext = () => setCurPage(curPage + 1);

  const onPrev = () => setCurPage(curPage - 1);

  return {
    ${meta.plural.model},
    handleFetch,
    loading,
    onNext,
    onPrev,
    setCurPage,
    curPage,
    total,
    tableMeta,
    onSetRowsPerPage,
    edit${name.modelName},
    setEdit${name.modelName},
    formLoading,
    setSort,
    tableFields,
    viewColumns,
    filters,
    setFilters,
    selectedItems,
    toggleAllSelection,
    remove${meta.plural.capital},
    setDeletingMulti,
    toggleFieldVisibility,
    visibleColumns,
  };
};

  `;
};
