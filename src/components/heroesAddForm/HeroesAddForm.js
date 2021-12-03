import { Formik, Form, Field, ErrorMessage, useField } from 'formik';
import * as Yup from 'yup';
import { v4 as uuid } from 'uuid';
import { addedHero } from '../heroesList/heroesSlice';
import {selectAll} from '../heroesFilters/filtersSlice';
import { useDispatch, useSelector } from 'react-redux';
import {useHttp} from '../../hooks/http.hook';
import store from '../../store';

// Задача для этого компонента:
// Реализовать создание нового героя с введенными данными. Он должен попадать
// в общее состояние и отображаться в списке + фильтроваться
// Уникальный идентификатор персонажа можно сгенерировать через uiid
// Усложненная задача:
// Персонаж создается и в файле json при помощи метода POST
// Дополнительно:
// Элементы <option></option> желательно сформировать на базе
// данных из фильтров

const MyTextInput = ({label, ...props}) => {
    const [field, meta] = useField(props);
    return (
        <>
            <label htmlFor={props.name}>{label}</label>
            <input {...props} {...field} />
            {meta.touched && meta.error ? (
                <div className="error">{meta.error}</div>
            ) : null}
        </>
    )
}

const HeroesAddForm = () => {

    const dispatch = useDispatch();

    const {request} = useHttp();
    
    const filters = selectAll(store.getState());


    return (
        <Formik
            initialValues = {{
                name: '',
                description: '',
                element: '',   
            }}
            validationSchema = {Yup.object({
                name: Yup.string()
                          .min(2, 'Минимум 2 символа')
                          .required('Обязательное поле!'),
                description: Yup.string()
                          .required('Назначьте персонажу умение'),
                element: Yup.string()
                          .required('Выберите силу')
            })}
            onSubmit={ async (values, {resetForm}) => {
                const id = uuid();
                await request('http://localhost:3001/heroes', 'POST', JSON.stringify({id, ...values}))
                    .then(data => dispatch(addedHero(data)))
                resetForm({
                    name: '',
                    description: '',
                    element: '',   
                })
            }}
        >
            
                <Form className="border p-4 shadow-lg rounded">
                    <div className="mb-3">
                        <MyTextInput type="text" name="name" className="form-control" id="name" placeholder="Как меня зовут?"/>
                    </div>

                    <div className="mb-3">
                        <label htmlFor="description" className="form-label fs-4">Описание</label>
                        <Field
                            as="textarea"
                            name="description" 
                            className="form-control" 
                            id="description" 
                            placeholder="Что я умею?"
                            style={{"height": '130px'}}/>
                        <ErrorMessage name="description" component="div"/>
                    </div>

                    <div className="mb-3">
                        <label htmlFor="element" className="form-label">Выбрать элемент героя</label>
                        <Field 
                            className="form-select" 
                            id="element" 
                            name="element"
                            as="select">
                            <option>Я владею элементом...</option>
                            {filters.map(filter => {
                                    return (
                                        <option key={filter.name} value={filter.name}>{filter.label}</option>
                                    )
                                }
                            )}
                            <ErrorMessage name="element" component="div"/>
                        </Field>
                    </div>

                    <button type="submit" className="btn btn-primary">Создать</button>
                </Form>
            
        </Formik>
    )
}

export default HeroesAddForm ;