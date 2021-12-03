import { filterChange, fetchFilters, selectAll } from './filtersSlice'
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import store from '../../store';
const classNames = require('classnames');
// Задача для этого компонента:
// Фильтры должны формироваться на основании загруженных данных
// Фильтры должны отображать только нужных героев при выборе
// Активный фильтр имеет класс active
// Изменять json-файл для удобства МОЖНО!
// Представьте, что вы попросили бэкенд-разработчика об этом

const HeroesFilters = () => {

    const dispatch = useDispatch();
    const {activeFilter} = useSelector(state => state.filters);
    const filters = selectAll(store.getState());
    
    useEffect(() => {
        dispatch(fetchFilters())
        // eslint-disable-next-line
    }, [])

    const onFilterHandler = (e) => {
        dispatch(filterChange(e.target.value))
    }

    return (
        <div className="card shadow-lg mt-4">
            <div className="card-body">
                <p className="card-text">Отфильтруйте героев по элементам</p>
                <div className="btn-group">
                    {filters.map(filter => {
                        let activeClass = filter.name === activeFilter ? true : false;
                       
                        const btnClass = classNames('btn', `${filter.class}`, {active: activeClass})
                        return <button onClick={(e) => onFilterHandler(e)} key={filter.name} value={filter.name} className={btnClass}>{filter.label}</button>
                    })}
                </div>
            </div>
        </div>
    )
}

export default HeroesFilters;