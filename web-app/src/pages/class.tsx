import StudentResponse from "../components/StudentResponse";
import styles from "./class.module.css";

function ClassPage() {
  return (
    <main className={styles.main}>
      <header className="w-full flex justify-center pb-5">
        <p className={styles.title}>Class Page</p>
      </header>
      <StudentResponse subtitle="Zanan" textAnswer="I am here" />
    </main>
  );
}

export default ClassPage;
