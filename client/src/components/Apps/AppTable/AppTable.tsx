import { Fragment, useEffect, useState } from 'react';
import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
} from 'react-beautiful-dnd';
import { Link } from 'react-router-dom';

// Redux

import { useAtomValue } from 'jotai';
import { App } from '../../../interfaces';
import {
  appsAtom,
  useDeleteApp,
  usePinApp,
  useReorderApps,
  useUpdateApp,
} from '../../../state/app';
import { configAtom } from '../../../state/config';
import { useCreateNotification } from '../../../state/notification';
import { TableActions } from '../../Actions/TableActions';
import { Message, Table } from '../../UI';

interface Props {
  openFormForUpdating: (app: App) => void;
}

export const AppTable = (props: Props): JSX.Element => {
  const config = useAtomValue(configAtom);

  const apps = useAtomValue(appsAtom);
  const pinApp = usePinApp();
  const deleteApp = useDeleteApp();
  const reorderApps = useReorderApps();
  const updateApp = useUpdateApp();
  const createNotification = useCreateNotification();

  const [localApps, setLocalApps] = useState<App[]>([]);

  // Copy apps array
  useEffect(() => {
    setLocalApps([...apps]);
  }, [apps]);

  const dragEndHanlder = (result: DropResult): void => {
    if (config.useOrdering !== 'orderId') {
      createNotification({
        title: 'Error',
        message: 'Custom order is disabled',
      });
      return;
    }

    if (!result.destination) {
      return;
    }

    const tmpApps = [...localApps];
    const [movedApp] = tmpApps.splice(result.source.index, 1);
    tmpApps.splice(result.destination.index, 0, movedApp);

    setLocalApps(tmpApps);
    reorderApps(tmpApps);
  };

  // Action handlers
  const deleteAppHandler = (id: number, name: string) => {
    const proceed = window.confirm(`Are you sure you want to delete ${name}?`);

    if (proceed) {
      deleteApp(id);
    }
  };

  const updateAppHandler = (id: number) => {
    const app = apps.find((a) => a.id === id) as App;
    props.openFormForUpdating(app);
  };

  const pinAppHandler = (id: number) => {
    const app = apps.find((a) => a.id === id) as App;
    pinApp(app);
  };

  const changeAppVisibiltyHandler = (id: number) => {
    const app = apps.find((a) => a.id === id) as App;
    updateApp(id, { ...app, isPublic: !app.isPublic });
  };

  return (
    <>
      <Message isPrimary={false}>
        {config.useOrdering === 'orderId' ? (
          <p>You can drag and drop single rows to reorder application</p>
        ) : (
          <p>
            Custom order is disabled. You can change it in the{' '}
            <Link to="/settings/general">settings</Link>
          </p>
        )}
      </Message>

      <DragDropContext onDragEnd={dragEndHanlder}>
        <Droppable droppableId="apps">
          {(provided) => (
            <Table
              headers={['Name', 'URL', 'Icon', 'Visibility', 'Actions']}
              innerRef={provided.innerRef}
            >
              {localApps.map((app: App, index): JSX.Element => {
                return (
                  <Draggable
                    key={app.id}
                    draggableId={app.id.toString()}
                    index={index}
                  >
                    {(provided, snapshot) => {
                      const style = {
                        border: snapshot.isDragging
                          ? '1px solid var(--color-accent)'
                          : 'none',
                        borderRadius: '4px',
                        ...provided.draggableProps.style,
                      };

                      return (
                        <tr
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          ref={provided.innerRef}
                          style={style}
                        >
                          <td style={{ width: '200px' }}>{app.name}</td>
                          <td style={{ width: '200px' }}>{app.url}</td>
                          <td style={{ width: '200px' }}>{app.icon}</td>
                          <td style={{ width: '200px' }}>
                            {app.isPublic ? 'Visible' : 'Hidden'}
                          </td>

                          {!snapshot.isDragging && (
                            <TableActions
                              entity={app}
                              deleteHandler={deleteAppHandler}
                              updateHandler={updateAppHandler}
                              pinHanlder={pinAppHandler}
                              changeVisibilty={changeAppVisibiltyHandler}
                            />
                          )}
                        </tr>
                      );
                    }}
                  </Draggable>
                );
              })}
            </Table>
          )}
        </Droppable>
      </DragDropContext>
    </>
  );
};
