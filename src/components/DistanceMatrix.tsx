import type { FloydStep } from "../algorithms/floydWarshall";

type Props = {
  step: FloydStep;
  nodes: {
    id: string;
  }[];
};

export default function DistanceMatrix({
  step,
  nodes,
}: Props) {
  return (
    <div className="matrix-container">
      <table className="distance-matrix">
        <thead>
          <tr>
            <th>From ↓ / To →</th>

            {nodes.map((node) => (
              <th key={node.id}>{node.id}</th>
            ))}
          </tr>
        </thead>

        <tbody>
          {step.matrix.map((row, i) => (
            <tr key={i}>
              <th>{nodes[i].id}</th>

              {row.map((value, j) => {
                const isActive =
                  step.i === i && step.j === j;

                return (
                  <td
                    key={j}
                    className={
                      isActive
                        ? step.updated
                          ? "matrix-cell matrix-updated"
                          : "matrix-cell matrix-active"
                        : "matrix-cell"
                    }
                  >
                    {value === Infinity ? "∞" : value}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}