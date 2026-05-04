import {
  OrderSelectType,
  LineItemSelectType,
  OrganizationSelectType,
  TeamSelectType,
} from "@/lib/db/schema";
import { format } from "date-fns";
import { styles } from "./styles";
import { formatUSD } from "@/lib/utils";
import { Document, Page, Text, View, Image } from "@react-pdf/renderer";

interface PackingSlipProps {
  data: OrderSelectType & {
    lineItems: LineItemSelectType[];
    organization: OrganizationSelectType;
    team: TeamSelectType;
  };
}

export const PackingSlip = ({ data }: PackingSlipProps) => {
  const metadata = data.organization.metadata
    ? JSON.parse(data.organization.metadata)
    : {};

  return (
    <Document title={`Packing Slip - ${data.id}`}>
      <Page size="A4" style={[{ padding: 20 }]}>
        <View style={[{ borderWidth: 1 }]}>
          <View
            style={[
              styles.tableRow,
              {
                borderBottomWidth: 1,
                paddingHorizontal: 6,
                paddingVertical: 20,
              },
            ]}
          >
            <View
              style={[
                styles.headerLeft,
                {
                  flex: 1,
                  alignItems: "flex-start",
                },
              ]}
            >
              <Image
                src={process.env.BETTER_AUTH_URL + "/logo.png"}
                style={[styles.logo]}
              />

              <View style={[styles.headerContactText]}>
                <Text
                  style={{ fontSize: 14, fontWeight: "bold", marginBottom: 6 }}
                >
                  Jimenez Produce
                </Text>
                <Text>{metadata?.street || ""}</Text>
                <Text>{`${metadata?.city || ""}, ${metadata?.state || ""} ${metadata?.zip || ""}`}</Text>
                <Text>Phone: {data.organization?.phone}</Text>
                <Text>Email: {data.organization?.email}</Text>
              </View>
            </View>

            <View style={[styles.headerRight, { width: "40%" }]}>
              <Text
                style={[styles.docTitle, { fontSize: 24, marginBottom: 10 }]}
              >
                Packing Slip
              </Text>
              <View style={{ gap: 2 }}>
                <Text style={{ fontSize: 10 }}>
                  Invoice #:{" "}
                  <Text style={{ fontWeight: "bold" }}>{data.id}</Text>
                </Text>
                <Text style={{ fontSize: 10 }}>
                  Date: {format(new Date(data.createdAt!), "MMM dd, yyyy")}
                </Text>
              </View>
            </View>
          </View>

          {/* BILLING & SHIPPING SECTION */}
          <View style={[styles.tableRow]}>
            <View
              style={{
                width: "33%",
                padding: 6,
                paddingBottom: 40,
                borderRightWidth: 1,
              }}
            >
              <Text
                style={{
                  fontSize: 10,
                  marginBottom: 5,
                }}
              >
                P.O. Number
              </Text>

              <Text style={{ fontSize: 10 }}>{data.po}</Text>
            </View>
            <View
              style={{
                width: "33%",
                borderRightWidth: 1,
                padding: 6,
                paddingBottom: 40,
              }}
            >
              <Text
                style={{
                  fontSize: 10,
                  marginBottom: 5,
                }}
              >
                Bill To
              </Text>

              <Text style={{ fontSize: 10 }}>{data.team.name}</Text>
              <Text style={{ fontSize: 10 }}>{data.team.phone}</Text>
              <Text style={{ fontSize: 10 }}>{data.team.email}</Text>
            </View>
            <View
              style={{
                width: "33%",
                padding: 6,
                paddingBottom: 40,
              }}
            >
              <Text style={{ fontSize: 10, marginBottom: 5 }}>Ship To</Text>
              <Text style={{ fontSize: 10 }}>{data.team.name}</Text>
              <Text style={{ fontSize: 10 }}>{data.team.phone}</Text>
              <Text style={{ fontSize: 10 }}>{data.team.email}</Text>
            </View>
          </View>

          {/* LINE ITEMS TABLE */}
          <View style={styles.table}>
            <View
              style={[
                styles.tableRow,
                { backgroundColor: "#EEEEEE", borderBottomWidth: 1 },
              ]}
            >
              <View style={{ width: "15%" }}>
                <Text style={styles.tableColHeader}>Item #</Text>
              </View>
              <View style={{ width: "70%" }}>
                <Text style={styles.tableColHeader}>Description</Text>
              </View>

              <View style={{ width: "15%" }}>
                <Text
                  style={[
                    styles.tableColHeader,
                    { borderRightWidth: 0, textAlign: "right" },
                  ]}
                >
                  Quantity
                </Text>
              </View>
            </View>

            {data.lineItems?.map((item, index) => (
              <View
                key={index}
                style={[
                  styles.tableRow,
                  index % 2 !== 0 ? { backgroundColor: "#EEEEEE" } : {},
                ]}
              >
                <View style={{ width: "15%" }}>
                  <Text style={styles.tableCell}>{item.identifier}</Text>
                </View>
                <View style={{ width: "70%" }}>
                  <Text style={styles.tableCell}>{item.title}</Text>
                </View>

                <View style={{ width: "15%" }}>
                  <Text
                    style={[
                      styles.tableCell,
                      { textAlign: "right", borderRightWidth: 0 },
                    ]}
                  >
                    {item.quantity}
                  </Text>
                </View>
              </View>
            ))}
          </View>

          {/* TOTALS SECTION */}
          <View style={styles.tableRow}>
            <View style={{ flex: 1, borderRightWidth: 1, padding: 6 }}>
              <Text
                style={{ fontSize: 10, fontWeight: "bold", marginBottom: 5 }}
              >
                Notes & Instructions:
              </Text>
            </View>

            <View style={{ width: "40%" }}>
              <View
                style={[styles.tableRow, { padding: 6, borderBottomWidth: 1 }]}
              >
                <Text style={{ fontSize: 10, flex: 1 }}>Item Count</Text>
                <Text style={{ fontSize: 10 }}>{data.lineItemCount}</Text>
              </View>

              <View style={[styles.tableRow, { padding: 6 }]}>
                <Text
                  style={{
                    fontSize: 11,
                    fontWeight: "bold",
                    flex: 1,
                  }}
                >
                  Total Quantity
                </Text>
                <Text style={{ fontSize: 11, fontWeight: "bold" }}>
                  {data.lineItemQuantity}
                </Text>
              </View>
            </View>
          </View>

          {/* FOOTER */}
        </View>
      </Page>
    </Document>
  );
};
