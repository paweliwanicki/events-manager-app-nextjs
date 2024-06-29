import { ReactNode } from 'react';
import SvgIcon from '../SvgIcon/SvgIcon';
import classes from './Table.module.scss';

type TableProps<T> = {
  data: T[];
  fields: string[];
  noDataPlaceholderText?: ReactNode;
  id?: string;
  classNames?: string;
  actions?: Record<string, (el: T) => void>;
};

const Table = <T extends { id: number }>({
  data,
  fields,
  actions,
  noDataPlaceholderText,
  id = '',
  classNames = '',
}: TableProps<T>) => {
  return data?.length ? (
    <table id={id} className={`${classes.commonTable} ${classNames}`}>
      <thead>
        <tr>
          <th>No.</th>
          {fields.map((field) => (
            <th key={`th-key-${String(field)}`}>{String(field)}</th>
          ))}
          {actions && <th>...</th>}
        </tr>
      </thead>
      <tbody>
        {data.map((el, index) => {
          return (
            <tr key={`tr-key-${el.id}`}>
              <td width="50" key={`td-key-${index}`}>
                {index + 1}.
              </td>
              {fields.map((field) => (
                <td key={`td-key-${String(field)}-${el.id}`}>
                  {el[field as keyof T] as ReactNode}
                </td>
              ))}
              {actions && (
                <td
                  key={`td-key-actions-${el.id}`}
                  className={classes.actionsColumn}
                  width={Object.keys(actions).length * 35}
                >
                  {Object.entries(actions).map(([key, callback]) => (
                    <SvgIcon
                      key={`icon-${el.id}-action-${key}`}
                      id={`icon-${key}`}
                      elementId={`icon-action-${key}`}
                      onClick={() => callback(el)}
                      width={20}
                      height={20}
                      color="#19202d"
                      hoverColor="#696e76"
                    />
                  ))}
                </td>
              )}
            </tr>
          );
        })}
      </tbody>
    </table>
  ) : (
    <div className={classes.noData}>
      {noDataPlaceholderText ? noDataPlaceholderText : 'No data'}
    </div>
  );
};

export default Table;
