from datetime import datetime, timedelta
from airflow import DAG
from airflow.operators.bash_operator import BashOperator

default_args = {
    'owner': 'airflow',
    'depends_on_past': False,
    'start_date': datetime(2022, 2, 20),
    'retries': 1,
    'retry_delay': timedelta(minutes=5)
}

dag = DAG(
    'example_dag',
    default_args=default_args,
    description='Example DAG',
    schedule_interval=timedelta(days=1)
)

task1 = BashOperator(
    task_id='task1',
    bash_command='echo "Hello World"',
    dag=dag
)

task2 = BashOperator(
    task_id='task2',
    bash_command='echo "Goodbye World"',
    dag=dag
)

task2.set_upstream(task1)
