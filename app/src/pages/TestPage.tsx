import React from 'react'
import { QUESTIONS } from '../data/questions'
import { scoreAnswers, interpretTotals } from '../utils/scoring'

export default function TestPage(){
    const [answers, setAnswers] = React.useState<Record<number,string>>({})
    const [result, setResult] = React.useState<any>(null)

    function handleChange(qid:number, aid:string){
        setAnswers(prev=> ({...prev, [qid]:aid}))
    }

    function handleSubmit(e:React.FormEvent){
        e.preventDefault()
        // Обрахунок балів
        const totals = scoreAnswers(answers)
        const interp = interpretTotals(totals)

        // Збереження результату у localStorage
        localStorage.setItem('test_result', JSON.stringify(totals))

        setResult(interp)
    }

    return (
        <div className="test-page">
            <h2 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1rem' }}>Тест з профорієнтації</h2>
            <form onSubmit={handleSubmit} className="test-form">
                {QUESTIONS.map(q=> (
                    <div key={q.id} className="question-card">
                        <div className="question-text">{q.id}. {q.text}</div>
                        <div className="options-group">
                            {q.options.map(o=> (
                                <label key={o.id} className="option-label">
                                    <input type="radio" name={`q${q.id}`} onChange={()=>handleChange(q.id, o.id)} checked={answers[q.id]===o.id} />
                                    <span>{o.text}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                ))}

                <div className="submit-area">
                    <button type="submit" className="btn-primary">Отримати результат</button>
                </div>
            </form>

            {result && (
                <div className="results-box">
                    <h3 className="results-title">Рекомендації</h3>
                    <p style={{ marginTop: '0.5rem', fontWeight: '600' }}>Основний профіль: {result.primary.title}</p>
                    <p>{result.primary.description}</p>
                    <p style={{ marginTop: '0.5rem', fontWeight: '600' }}>Можливі професії:</p>
                    <ul className="list-disc">
                        {result.primary.careers.map((c:string)=> <li key={c}>{c}</li>)}
                    </ul>

                    <div style={{ marginTop: '1rem' }}>
                        <p style={{ fontWeight: '600' }}>Другорядний профіль: {result.secondary.title}</p>
                        <p>{result.secondary.description}</p>
                        <p style={{ marginTop: '0.5rem', fontWeight: '600' }}>Професії з другого профілю:</p>
                        <ul className="list-disc">
                            {result.secondary.careers.map((c:string)=> <li key={c}>{c}</li>)}
                        </ul>
                    </div>

                    <div style={{ marginTop: '1rem' }}>
                        <p style={{ fontWeight: '600' }}>Сирові бали:</p>
                        <pre style={{ background: 'white', padding: '0.5rem', borderRadius: '0.25rem', marginTop: '0.5rem' }}>{JSON.stringify(result.raw, null, 2)}</pre>
                    </div>
                </div>
            )}
        </div>
    )
}