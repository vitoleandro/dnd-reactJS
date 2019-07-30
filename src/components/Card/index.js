import React, {useRef, useContext} from 'react';
import { useDrag, useDrop } from 'react-dnd';

import BoardContext from '../../components/Board/context';
import { Container, Label } from './styles';

export default function Card({ data, index, listIndex }) {

  const ref = useRef();
  const { move } = useContext(BoardContext);

  const [{isDragging}, dragRef] = useDrag({
    item: { type: 'CARD', index, id: data.id, content: data.content, listIndex },
    collect: monitor => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, dropRef] = useDrop({
    accept: 'CARD',
    hover(item, monitor) {
      const draggedListIndex = item.listIndex;
      const targetLisiIndex = listIndex;
      
      const draggedIndex = item.index;
      const targetIndex = index;

      if(draggedIndex === targetIndex && draggedListIndex === targetLisiIndex) {
        return;
      }

      const targetSize = ref.current.getBoundingClientRect();
      const targetCenter = (targetSize.bottom - targetSize.top) / 2;

      const draggedOffSet = monitor.getClientOffset()
      const draggedTop = draggedOffSet.y - targetSize.top;

      if(draggedIndex < targetIndex && draggedTop < targetCenter)  {
        return;
      }

      if(draggedIndex > targetIndex && draggedTop > targetCenter) {
        return;
      }

      move(draggedListIndex,targetLisiIndex, draggedIndex, targetIndex)

      item.index = targetIndex
      item.listIndex = targetLisiIndex
    }
  })

  dragRef(dropRef(ref))

  return (
    <Container ref={ref} isDragging={isDragging}>
      <header>
        {data.labels.map(label => <Label color={label} />)}
      </header>
      <p>{ data.content }</p>
      { data.user && <img src={ data.user } alt=""/> }
    </Container>
  );
}
