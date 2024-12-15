#!/bin/bash
sleep 10

mongosh --host mongo:27017 <<EOF
rs.initiate({
  _id: "rs0",
  members: [
    { _id: 0, host: "mongo:27017" }
  ]
});
EOF